'use server'

import { createClient } from '@/lib/supabase/server'
import { donationSchema } from '@/lib/validations/schemas'
import { getPaymentProvider } from '@/lib/payments/create-payment'
import { createAuditLog } from '@/lib/audit'
import { sendDonationThankYouEmail } from '@/lib/email/templates'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function createDonation(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  // Auth is optional for donations (guests can donate)
  const { data: { user } } = await supabase.auth.getUser()

  // Parse and validate
  const raw = Object.fromEntries(formData)
  const parsed = donationSchema.safeParse({
    tournament_id: raw.tournament_id,
    donor_name: raw.donor_name,
    email: raw.email || '',
    phone: raw.phone || '',
    amount: parseInt(raw.amount as string) || 0,
    message: raw.message || '',
    is_anonymous: raw.is_anonymous === 'true',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  const data = parsed.data

  // Verify tournament exists
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('id, title, status')
    .eq('id', data.tournament_id)
    .single()

  if (!tournament || tournament.status !== 'published') {
    return { error: 'Giải đấu không tồn tại hoặc chưa mở' }
  }

  // Create donation
  const { data: donation, error } = await supabase
    .from('donations')
    .insert({
      tournament_id: data.tournament_id,
      user_id: user?.id || null,
      donor_name: data.donor_name,
      email: data.email || null,
      phone: data.phone || null,
      amount: data.amount,
      message: data.message || null,
      is_anonymous: data.is_anonymous,
      status: 'pending',
      payment_status: 'pending',
    })
    .select('id, donation_code')
    .single()

  if (error) {
    return { error: 'Không thể tạo ủng hộ: ' + error.message }
  }

  // Audit log
  await createAuditLog({
    action: 'donation.create',
    target_table: 'donations',
    target_id: donation.id,
    metadata: { amount: data.amount, tournament_id: data.tournament_id },
  })

  // Create payment
  try {
    const provider = getPaymentProvider()
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const baseUrl = `${protocol}://${host}`

    // Create payment transaction
    await supabase.from('payment_transactions').insert({
      transaction_type: 'donation',
      donation_id: donation.id,
      user_id: user?.id || null,
      provider: provider.name,
      provider_order_id: donation.donation_code,
      amount: data.amount,
      status: 'pending',
    })

    // -------------------------------------------------------------
    // Skip external payment provider call for manual banking flow
    // -------------------------------------------------------------
    
    // Instead of jumping to VNPAY, we just return the fact that it was successful
    // The client UI will open the QR code manually.
    return {
      success: true,
      donationCode: donation.donation_code,
      amount: data.amount,
      isManualBanking: true
    }

  } catch (e: any) {
    return {
      success: true,
      paymentError: e.message,
      donationCode: donation.donation_code,
    }
  }
}

export async function getDonationsForTournament(tournamentId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('donations')
    .select('donor_name, amount, message, is_anonymous, created_at')
    .eq('tournament_id', tournamentId)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })
    .limit(50)

  return (data || []).map((d: any) => ({
    ...d,
    donor_name: d.is_anonymous ? 'Ẩn danh' : d.donor_name,
  }))
}
