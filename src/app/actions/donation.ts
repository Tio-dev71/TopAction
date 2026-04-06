'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDonation(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Ensure user is logged in
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return { redirect: '/dang-nhap?redirect=' + encodeURIComponent(formData.get('redirectPath') as string || '/') }
  }

  const tournament_id = formData.get('tournament_id') as string
  const donor_name = formData.get('donor_name') as string
  const amountStr = formData.get('amount') as string
  const message = formData.get('message') as string

  if (!tournament_id || !donor_name || !amountStr) {
    return { error: 'Vui lòng điền đầy đủ tên và số tiền.' }
  }

  const amount = parseInt(amountStr.replace(/\D/g, ''), 10)
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Số tiền không hợp lệ.' }
  }

  const { error } = await supabase.from('donations').insert({
    tournament_id,
    user_id: session.user.id,
    donor_name,
    amount,
    message,
    payment_method: 'bank_transfer',
    status: 'pending'
  })

  if (error) {
    console.error('Donation error:', error)
    return { error: 'Đã có lỗi xảy ra. Không thể lưu dữ liệu ủng hộ.' }
  }

  // Next.js will revalidate the page to fetch the newly created (although pending)
  revalidatePath(`/giai-dau/${formData.get('slug')}`)

  return { success: true }
}

export async function getDonations(tournamentId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('tournament_id', tournamentId)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Fetch donations error:', error)
    return []
  }

  return data
}

export async function getTotalDonations(tournamentId: string) {
  const supabase = await createClient()
  
  // Custom RPC or sum
  // Standard supabase sum using aggregations not trivially available without an RPC. 
  // We'll calculate it from pending/confirmed locally for now as it's typically fine for smaller datasets
  // Or we can query the tournaments table if there's a trigger.
  const { data, error } = await supabase
    .from('donations')
    .select('amount')
    .eq('tournament_id', tournamentId)
    .eq('status', 'confirmed')

  if (error) {
    return 0
  }

  return data.reduce((acc, curr) => acc + (curr.amount || 0), 0)
}
