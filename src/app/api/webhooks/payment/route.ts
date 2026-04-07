import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPaymentProvider } from '@/lib/payments/create-payment'
import { sendPaymentSuccessEmail, sendDonationThankYouEmail } from '@/lib/email/templates'


export async function GET(request: NextRequest) {
  return handleWebhook(request)
}

export async function POST(request: NextRequest) {
  return handleWebhook(request)
}

async function handleWebhook(request: NextRequest) {
  const provider = getPaymentProvider()
  const supabase = await createAdminClient()

  try {
    // Parse request
    const url = new URL(request.url)
    const queryParams = Object.fromEntries(url.searchParams)

    let body: string | Record<string, unknown> = ''
    try {
      const text = await request.text()
      try { body = JSON.parse(text) } catch { body = text }
    } catch { /* empty body */ }

    const headersObj: Record<string, string> = {}
    request.headers.forEach((val, key) => { headersObj[key] = val })

    // Verify webhook
    const result = await provider.verifyWebhook({
      headers: headersObj,
      body,
      query: queryParams,
    })

    if (!result.valid) {
      console.error('[WEBHOOK] Invalid signature')
      return NextResponse.json({ RspCode: '97', Message: 'Invalid Signature' }, { status: 400 })
    }

    // Idempotency check
    if (result.externalEventId) {
      const { data: existing } = await supabase
        .from('webhook_events')
        .select('id, processed')
        .eq('provider', provider.name)
        .eq('external_event_id', result.externalEventId)
        .single()

      if (existing?.processed) {
        return NextResponse.json({ RspCode: '00', Message: 'Already processed' })
      }

      // Record the event
      if (!existing) {
        await supabase.from('webhook_events').insert({
          provider: provider.name,
          event_type: 'payment_callback',
          external_event_id: result.externalEventId,
          payload: result.rawData || {},
        })
      }
    }

    // Find the order by registration_code or donation_code
    const orderId = result.orderId

    // Try registration
    const { data: registration } = await supabase
      .from('registrations')
      .select('id, user_id, email, full_name, tournament_id, amount_due')
      .eq('registration_code', orderId)
      .single()

    // Try donation
    const { data: donation } = await supabase
      .from('donations')
      .select('id, user_id, email, donor_name, tournament_id, amount')
      .eq('donation_code', orderId)
      .single()

    if (result.status === 'success') {
      // ---- Process successful payment ----

      if (registration) {
        // Update registration
        await supabase
          .from('registrations')
          .update({
            status: 'registered',
            payment_status: 'paid',
            amount_paid: result.amount,
          })
          .eq('id', registration.id)

        // Log status change
        await supabase.from('registration_status_logs').insert({
          registration_id: registration.id,
          old_status: 'pending_payment',
          new_status: 'registered',
          note: `Thanh toán thành công qua ${provider.name}`,
        })

        // Get tournament title for email
        const { data: tournament } = await supabase
          .from('tournaments')
          .select('title')
          .eq('id', registration.tournament_id)
          .single()

        // Send email
        if (registration.email) {
          await sendPaymentSuccessEmail({
            email: registration.email,
            fullName: registration.full_name,
            tournamentTitle: tournament?.title || '',
            amount: result.amount,
            transactionType: 'registration',
            referenceCode: orderId,
          })
        }
      }

      if (donation) {
        // Update donation
        await supabase
          .from('donations')
          .update({
            status: 'paid',
            payment_status: 'paid',
            provider: provider.name,
            provider_transaction_id: result.providerTransactionId || null,
          })
          .eq('id', donation.id)

        // Get tournament
        const { data: tournament } = await supabase
          .from('tournaments')
          .select('title')
          .eq('id', donation.tournament_id)
          .single()

        if (donation.email) {
          await sendDonationThankYouEmail({
            email: donation.email,
            donorName: donation.donor_name,
            tournamentTitle: tournament?.title || '',
            amount: donation.amount,
            donationCode: orderId,
          })
        }
      }

      // Update payment transaction
      await supabase
        .from('payment_transactions')
        .update({
          status: 'success',
          provider_transaction_id: result.providerTransactionId || null,
          paid_at: new Date().toISOString(),
          raw_response: result.rawData || null,
        })
        .eq('provider_order_id', orderId)

    } else {
      // ---- Failed/cancelled payment ----
      const failStatus = result.status === 'cancelled' ? 'cancelled' : 'failed'

      if (registration) {
        await supabase
          .from('registrations')
          .update({ payment_status: failStatus })
          .eq('id', registration.id)
      }

      if (donation) {
        await supabase
          .from('donations')
          .update({ status: failStatus, payment_status: failStatus })
          .eq('id', donation.id)
      }

      await supabase
        .from('payment_transactions')
        .update({ status: failStatus, raw_response: result.rawData || null })
        .eq('provider_order_id', orderId)
    }

    // Mark webhook as processed
    if (result.externalEventId) {
      await supabase
        .from('webhook_events')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('provider', provider.name)
        .eq('external_event_id', result.externalEventId)
    }

    // VNPay expects this response format
    return NextResponse.json({ RspCode: '00', Message: 'Confirm Success' })

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error)
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' }, { status: 500 })
  }
}
