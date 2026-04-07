'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Simulate marking a transaction as paid for testing the realtime UI.
 * This should ONLY be used in development or as a temporary manual test tool.
 */
export async function simulateDonationPayment(donationCode: string) {
  const supabase = await createClient()

  // Find the donation
  const { data: donation } = await supabase
    .from('donations')
    .select('id, amount')
    .eq('donation_code', donationCode)
    .single()

  if (!donation) {
    return { error: 'Không tìm thấy đơn ủng hộ' }
  }

  // Update donation status
  const { error } = await supabase
    .from('donations')
    .update({
      status: 'paid',
      payment_status: 'paid',
      provider: 'manual_transfer',
      provider_transaction_id: `MOCK_${Date.now()}`
    })
    .eq('id', donation.id)

  if (error) {
    return { error: 'Không thể cập nhật trạng thái' }
  }

  // Update transaction status
  await supabase
    .from('payment_transactions')
    .update({
      status: 'success',
      paid_at: new Date().toISOString()
    })
    .eq('provider_order_id', donationCode)

  revalidatePath('/admin/')
  revalidatePath('/giai-dau')
  
  return { success: true }
}
