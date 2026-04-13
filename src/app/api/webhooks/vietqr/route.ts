import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text()
    let body
    try {
      body = JSON.parse(bodyText)
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 })
    }

    console.log('[VIETQR WEBHOOK] Received:', bodyText)

    // Extract relevant data, handling both Object and Array wrapped structures
    let amount = 0
    let content = ''
    let transactionId = ''

    // API VietQR có thể nhúng data trong body.data array hoặc trả luôn về object
    const payload = Array.isArray(body.data) ? body.data[0] : (body.data || body)
    
    amount = payload.amount || payload.transferAmount || payload.creditAmount || payload.value || 0
    content = payload.description || payload.content || payload.remark || payload.message || ''
    transactionId = payload.transactionId || payload.tid || payload.referenceCode || payload.id || Date.now().toString()

    amount = typeof amount === 'string' ? parseFloat(amount) : amount

    // We only care about valid incoming money
    if (amount <= 0 || !content) {
      return NextResponse.json({ success: true, message: 'Ignored zero amount or missing content' })
    }

    const supabase = await createAdminClient()

    // 1. Save raw webhook event for debugging
    await supabase.from('webhook_events').insert({
      provider: 'vietqr',
      external_event_id: transactionId.toString(),
      payload: body,
    })

    // 2. Extract our 10-character code using Regex
    const matchedCodes = content.match(/[A-Z0-9]{10}/ig)

    if (!matchedCodes || matchedCodes.length === 0) {
      return NextResponse.json({ success: true, message: 'No valid code found in content' })
    }

    let processedCount = 0;

    // Check each potential code found in the transfer content
    for (const rawCode of matchedCodes) {
      const code = rawCode.toUpperCase()

      // A) Check Donations
      const { data: donation } = await supabase
        .from('donations')
        .select('id, status, amount, tournament_id')
        .eq('donation_code', code)
        .single()

      if (donation && donation.status !== 'paid') {
        // Mark as paid
        await supabase
          .from('donations')
          .update({
            status: 'paid',
            payment_status: 'paid',
            provider: 'vietqr',
            provider_transaction_id: transactionId.toString(),
          })
          .eq('id', donation.id)

        // Also record in payment_transactions
        await supabase.from('payment_transactions').insert({
          transaction_type: 'donation',
          donation_id: donation.id,
          provider: 'vietqr',
          provider_order_id: code,
          amount: amount,
          status: 'success',
          paid_at: new Date().toISOString(),
          raw_response: body
        })

        // NOTE: The `update_tournament_donation_total_on_paid` trigger in Supabase (from 001_complete_schema) 
        // will automatically aggregate this into `tournaments.donation_total`.

        processedCount++;
        continue;
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
            amount_paid: amount,
          })
          .eq('id', registration.id)

        await supabase.from('registration_status_logs').insert({
          registration_id: registration.id,
          old_status: 'pending_payment',
          new_status: 'registered',
          note: `Thanh toán qua VietQR (Biến động số dư)`,
        })

        // Also record in payment_transactions
        await supabase.from('payment_transactions').insert({
          transaction_type: 'registration',
          registration_id: registration.id,
          provider: 'vietqr',
          provider_order_id: code,
          amount: amount,
          status: 'success',
          paid_at: new Date().toISOString(),
          raw_response: body
        })

        processedCount++;
      }
    }

    if (processedCount > 0) {
      return NextResponse.json({ success: true, message: `Processed ${processedCount} transactions successfully` })
    } else {
      return NextResponse.json({ success: true, message: 'Code matched but no pending transactions found' })
    }

  } catch (error) {
    console.error('[VIETQR WEBHOOK ERROR]', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
