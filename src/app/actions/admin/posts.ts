'use server'

import { createClient } from '@/lib/supabase/server'
import { requireStaff } from '@/lib/auth/permissions'
import { createAuditLog } from '@/lib/audit'
import { postSchema } from '@/lib/validations/schemas'
import { revalidatePath } from 'next/cache'

export async function createPost(prevState: any, formData: FormData) {
  const { user } = await requireStaff()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData)
  const parsed = postSchema.safeParse({
    ...raw,
    tournament_id: raw.tournament_id || null,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  const insertData: any = {
    ...parsed.data,
    created_by: user.id,
  }

  if (parsed.data.status === 'published') {
    insertData.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('posts')
    .insert(insertData)
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Slug đã tồn tại.' }
    return { error: error.message }
  }

  await createAuditLog({
    action: 'post.create',
    target_table: 'posts',
    target_id: data.id,
    metadata: { title: parsed.data.title },
  })

  revalidatePath('/admin/bai-viet')
  return { success: true, id: data.id }
}

export async function updatePost(id: string, prevState: any, formData: FormData) {
  await requireStaff()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData)
  const parsed = postSchema.safeParse({
    ...raw,
    tournament_id: raw.tournament_id || null,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  const updateData: any = { ...parsed.data }
  if (parsed.data.status === 'published' && !raw.published_at) {
    updateData.published_at = new Date().toISOString()
  }

  const { error } = await supabase.from('posts').update(updateData).eq('id', id)

  if (error) return { error: error.message }

  await createAuditLog({
    action: 'post.update',
    target_table: 'posts',
    target_id: id,
  })

  revalidatePath('/admin/bai-viet')
  return { success: true }
}

export async function deletePost(id: string) {
  await requireStaff()
  const supabase = await createClient()

  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { error: error.message }

  await createAuditLog({ action: 'post.delete', target_table: 'posts', target_id: id })
  revalidatePath('/admin/bai-viet')
  return { success: true }
}
