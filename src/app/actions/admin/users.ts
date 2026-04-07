'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/permissions'
import { createAuditLog } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

export async function assignRole(userId: string, roleId: string) {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role_id: roleId })

  if (error) {
    if (error.code === '23505') return { error: 'Vai trò đã được gán' }
    return { error: error.message }
  }

  await createAuditLog({
    action: 'user.assign_role',
    target_table: 'user_roles',
    target_id: userId,
    metadata: { role_id: roleId },
  })

  revalidatePath(`/admin/nguoi-dung/${userId}`)
  return { success: true }
}

export async function removeRole(userId: string, roleCode: string) {
  const { user } = await requireAdmin()
  const supabase = await createClient()

  // Get role ID
  const { data: role } = await supabase
    .from('roles')
    .select('id')
    .eq('code', roleCode)
    .single()

  if (!role) return { error: 'Không tìm thấy vai trò' }

  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role_id', role.id)

  if (error) return { error: error.message }

  await createAuditLog({
    action: 'user.remove_role',
    target_table: 'user_roles',
    target_id: userId,
    metadata: { role_code: roleCode },
  })

  revalidatePath(`/admin/nguoi-dung/${userId}`)
  return { success: true }
}
