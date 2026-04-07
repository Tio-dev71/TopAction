'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/permissions'
import { registrationSchema } from '@/lib/validations/schemas'
import { createAuditLog } from '@/lib/audit'
import { getPaymentProvider } from '@/lib/payments/create-payment'
import { sendRegistrationSuccessEmail } from '@/lib/email/templates'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function createRegistration(prevState: any, formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Handle missing fields (unchecked radios or empty inputs become undefined)
  const raw = {
    ...Object.fromEntries(formData),
    category_id: formData.get('category_id') || '',
    gender: formData.get('gender') || '',
  }
  
  const parsed = registrationSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = parsed.data

  // 1. Check tournament exists and is open for registration
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('id, title, slug, status, registration_open_at, registration_close_at, max_participants, participant_count')
    .eq('id', data.tournament_id)
    .single()

  if (!tournament) return { error: 'Giải đấu không tồn tại' }
  if (tournament.status !== 'published') return { error: 'Giải đấu chưa mở đăng ký' }

  const now = new Date().toISOString()
  if (tournament.registration_open_at && now < tournament.registration_open_at) {
    return { error: 'Chưa đến thời gian đăng ký' }
  }
  if (tournament.registration_close_at && now > tournament.registration_close_at) {
    return { error: 'Đã hết hạn đăng ký' }
  }

  // 2. Check capacity
  if (tournament.max_participants && tournament.participant_count >= tournament.max_participants) {
    return { error: 'Giải đấu đã đầy' }
  }

  // 3. Check category
  const { data: category } = await supabase
    .from('tournament_categories')
    .select('*')
    .eq('id', data.category_id)
    .eq('tournament_id', data.tournament_id)
    .single()

  if (!category) return { error: 'Hạng mục không tồn tại' }
  if (!category.is_active) return { error: 'Hạng mục đã đóng' }
  if (category.capacity && category.registered_count >= category.capacity) {
    return { error: 'Hạng mục đã đầy' }
  }

  // 4. Check duplicate registration (unique index handles this too)
  const { data: existing } = await supabase
    .from('registrations')
    .select('id')
    .eq('user_id', user.id)
    .eq('tournament_id', data.tournament_id)
    .eq('category_id', data.category_id)
    .not('status', 'in', '("cancelled","rejected")')
    .limit(1)

  if (existing && existing.length > 0) {
    return { error: 'Bạn đã đăng ký hạng mục này rồi' }
  }

  // 5. Determine if payment is required
  const paymentRequired = category.price > 0
  const status = paymentRequired ? 'pending_payment' : 'registered'
  const paymentStatus = paymentRequired ? 'unpaid' : 'paid'

  // 6. Create registration
  const { data: registration, error: insertError } = await supabase
    .from('registrations')
    .insert({
      tournament_id: data.tournament_id,
      user_id: user.id,
      category_id: data.category_id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      gender: data.gender || null,
      birth_date: data.birth_date || null,
      city: data.city || null,
      club_name: data.club_name || null,
      team_name: data.team_name || null,
      emergency_contact: data.emergency_contact || null,
      note: data.note || null,
      status,
      payment_status: paymentStatus,
      payment_required: paymentRequired,
      amount_due: category.price,
    })
    .select('id, registration_code')
    .single()

  if (insertError) {
    if (insertError.code === '23505') return { error: 'Bạn đã đăng ký hạng mục này rồi' }
    return { error: 'Không thể tạo đăng ký: ' + insertError.message }
  }

  // 7. Log status
  await supabase.from('registration_status_logs').insert({
    registration_id: registration.id,
    old_status: null,
    new_status: status,
    changed_by: user.id,
    note: 'Đăng ký mới',
  })

  // 8. Audit log
  await createAuditLog({
    action: 'registration.create',
    target_table: 'registrations',
    target_id: registration.id,
    metadata: { tournament_id: data.tournament_id, category_id: data.category_id },
  })

  // 9. Send email
  await sendRegistrationSuccessEmail({
    email: data.email,
    fullName: data.full_name,
    tournamentTitle: tournament.title,
    categoryName: category.name,
    registrationCode: registration.registration_code,
    amountDue: category.price,
    isPaid: !paymentRequired,
  })

  // 10. If paid, create payment and redirect
  if (paymentRequired) {
    try {
      const provider = getPaymentProvider()
      const headersList = await headers()
      const host = headersList.get('host') || 'localhost:3000'
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
      const baseUrl = `${protocol}://${host}`

      // Create payment transaction record
      const { data: paymentTx } = await supabase
        .from('payment_transactions')
        .insert({
          transaction_type: 'registration',
          registration_id: registration.id,
          user_id: user.id,
          provider: provider.name,
          amount: category.price,
          status: 'created',
        })
        .select('id')
        .single()

      const paymentResult = await provider.createPayment({
        orderId: registration.registration_code,
        amount: category.price,
        description: `DK ${tournament.title} - ${category.name}`,
        returnUrl: `${baseUrl}/thanh-toan/ket-qua?type=registration&code=${registration.registration_code}`,
      })

      if (paymentResult.success && paymentResult.paymentUrl) {
        // Update transaction with provider order ID
        if (paymentTx) {
          await supabase
            .from('payment_transactions')
            .update({
              provider_order_id: paymentResult.providerOrderId,
              status: 'pending',
              raw_request: paymentResult.rawResponse || null,
            })
            .eq('id', paymentTx.id)
        }

        revalidatePath('/ca-nhan')
        return {
          success: true,
          paymentRequired: true,
          paymentUrl: paymentResult.paymentUrl,
          registrationCode: registration.registration_code,
        }
      } else {
        // Payment creation failed — registration is still pending_payment
        return {
          success: true,
          paymentRequired: true,
          paymentError: paymentResult.error || 'Không thể tạo thanh toán',
          registrationCode: registration.registration_code,
        }
      }
    } catch (e: any) {
      return {
        success: true,
        paymentRequired: true,
        paymentError: e.message || 'Lỗi thanh toán',
        registrationCode: registration.registration_code,
      }
    }
  }

  revalidatePath('/ca-nhan')
  return {
    success: true,
    paymentRequired: false,
    registrationCode: registration.registration_code,
  }
}

export async function getMyRegistrations() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data } = await supabase
    .from('registrations')
    .select('*, tournament:tournaments(title, slug, start_date), category:tournament_categories(name, distance)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}
