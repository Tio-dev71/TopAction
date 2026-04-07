'use server'

import { createClient } from '@/lib/supabase/server'
import { requireStaff, requireAdmin } from '@/lib/auth/permissions'
import { createAuditLog } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

export async function updateRegistrationStatus(
  registrationId: string,
  newStatus: string,
  note?: string
) {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  // Get current status
  const { data: reg } = await supabase
    .from('registrations')
    .select('status, tournament_id')
    .eq('id', registrationId)
    .single()

  if (!reg) return { error: 'Không tìm thấy đơn đăng ký' }

  const oldStatus = reg.status

  // Update status
  const updateData: any = { status: newStatus }
  if (newStatus === 'confirmed' || newStatus === 'registered') {
    updateData.payment_status = 'paid'
  }

  const { error } = await supabase
    .from('registrations')
    .update(updateData)
    .eq('id', registrationId)

  if (error) return { error: error.message }

  // Log status change
  await supabase.from('registration_status_logs').insert({
    registration_id: registrationId,
    old_status: oldStatus,
    new_status: newStatus,
    changed_by: user.id,
    note: note || null,
  })

  await createAuditLog({
    action: `registration.${newStatus}`,
    target_table: 'registrations',
    target_id: registrationId,
    metadata: { old_status: oldStatus, new_status: newStatus, note },
  })

  revalidatePath('/admin/dang-ky')
  revalidatePath(`/admin/dang-ky/${registrationId}`)
  return { success: true }
}

export async function exportRegistrationsCSV(tournamentId?: string) {
  await requireStaff()
  const supabase = await createClient()

  let query = supabase
    .from('registrations')
    .select('*, tournament:tournaments(title), category:tournament_categories(name, distance)')
    .order('created_at', { ascending: false })

  if (tournamentId) {
    query = query.eq('tournament_id', tournamentId)
  }

  const { data } = await query

  if (!data || data.length === 0) return { error: 'Không có dữ liệu' }

  const headers = ['Mã ĐK', 'Họ tên', 'Email', 'SĐT', 'Giải đấu', 'Hạng mục', 'Trạng thái', 'Thanh toán', 'Phí', 'Đã TT', 'Ngày ĐK']
  const rows = data.map((r: any) => [
    r.registration_code,
    r.full_name,
    r.email,
    r.phone || '',
    (r.tournament as any)?.title || '',
    (r.category as any)?.name || '',
    r.status,
    r.payment_status,
    r.amount_due,
    r.amount_paid,
    new Date(r.created_at).toLocaleDateString('vi-VN'),
  ])

  const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n')
  
  return { success: true, csv }
}
