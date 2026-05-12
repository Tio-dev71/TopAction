import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[SEPAY WEBHOOK] Received:', body)

    // SePay often sends transferAmount, content, transferType
    const amount = body.transferAmount || 0
    const content = body.content || body.description || ''
    const transferType = body.transferType || 'in'

    // We only care about incoming money
    if (transferType === 'out' || amount <= 0) {
      return NextResponse.json({ success: true, message: 'Ignored outgoing or zero amount' })
    }

    const supabase = await createAdminClient()

    // 1. Save raw webhook event for debugging
    await supabase.from('webhook_events').insert({
      provider: 'sepay',
      external_event_id: body.id?.toString() || body.referenceCode || Date.now().toString(),
      payload: body,
    })

    // 2. Extract our 10-character code using Regex
    // Example content: "NGUYEN VAN A chuyen tien 87AEBF49E3"
    const matchedCodes = content.match(/[A-Z0-9]{10}/ig)
    let processedCount = 0;

    if (matchedCodes && matchedCodes.length > 0) {
      // Check each potential code found in the transfer content
      for (const rawCode of matchedCodes) {
        const code = rawCode.toUpperCase()

        // A) Check Donations
        const { data: donation } = await supabase
          .from('donations')
          .select('id, status, amount')
          .eq('donation_code', code)
          .single()

        if (donation && donation.status !== 'paid') {
          // Mark as paid
          await supabase
            .from('donations')
            .update({
              status: 'paid',
              payment_status: 'paid',
              provider: 'sepay',
              provider_transaction_id: body.id?.toString() || body.referenceCode || null,
            })
            .eq('id', donation.id)

          // Also record in payment_transactions
          await supabase.from('payment_transactions').insert({
            transaction_type: 'donation',
            donation_id: donation.id,
            provider: 'sepay',
            provider_order_id: code,
            amount: amount,
            status: 'success',
            paid_at: new Date().toISOString(),
            raw_response: body
          })

          processedCount++;
          continue; // found and processed, go to next code if any
        }

        // B) Check Registrations (if any)
        const { data: registration } = await supabase
          .from('registrations')
          .select('id, status, amount_due')
          .eq('registration_code', code)
          .single()

        if (registration && registration.status === 'pending_payment') {
          await supabase
            .from('registrations')
            .update({
              status: 'registered',
              payment_status: 'paid',
              amount_paid: amount, // record how much they actually transferred
            })
            .eq('id', registration.id)

          await supabase.from('registration_status_logs').insert({
            registration_id: registration.id,
            old_status: 'pending_payment',
            new_status: 'registered',
            note: `Thanh toán qua SePay (Biến động số dư MB Bank)`,
          })

          // Also record in payment_transactions
          await supabase.from('payment_transactions').insert({
            transaction_type: 'registration',
            registration_id: registration.id,
            provider: 'sepay',
            provider_order_id: code,
            amount: amount,
            status: 'success',
            paid_at: new Date().toISOString(),
            raw_response: body
          })

          processedCount++;
        }
      }
    }

    // 3. Fallback: Tự động ghi nhận chuyển khoản tự do không có mã thành lượt ủng hộ trực tiếp
    if (processedCount === 0) {
      const txId = body.id?.toString() || body.referenceCode || null
      if (txId) {
        const { data: existing } = await supabase
          .from('donations')
          .select('id')
          .eq('provider_transaction_id', txId)
          .single()

        if (existing) {
          revalidatePath('/', 'layout')
          return NextResponse.json({ success: true, message: 'Already captured in fallback' })
        }
      }

      // Tìm giải đấu chính đang publish
      const { data: tournaments } = await supabase
        .from('tournaments')
        .select('id')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(1)

      if (tournaments && tournaments.length > 0) {
        const tournamentId = tournaments[0].id
        // Lấy tên người chuyển từ nội dung
        const cleanName = content
          .replace(/chuyen tien|chuyển tiền|remit|transfer|thanh toan|thanh toán/gi, '')
          .replace(/\s+/g, ' ')
          .trim() || 'Nhà hảo tâm'

        const { data: newDonation } = await supabase
          .from('donations')
          .insert({
            tournament_id: tournamentId,
            donor_name: cleanName,
            amount: amount,
            message: content,
            status: 'paid',
            payment_status: 'paid',
            provider: 'sepay',
            provider_transaction_id: txId,
          })
          .select('id')
          .single()

        if (newDonation) {
          await supabase.from('payment_transactions').insert({
            transaction_type: 'donation',
            donation_id: newDonation.id,
            provider: 'sepay',
            provider_order_id: 'DIRECT_TRANSFER',
            amount: amount,
            status: 'success',
            paid_at: new Date().toISOString(),
            raw_response: body
          })
          processedCount++;
        }
      }
    }

    // Luôn gọi revalidatePath để làm mới giao diện web ngay lập tức
    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true, message: `Processed ${processedCount} transactions successfully` })

  } catch (error) {
    console.error('[SEPAY WEBHOOK ERROR]', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
