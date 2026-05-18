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
  const storyImageUrlsRaw = String(raw.story_image_urls || '')
  const storyImageUrls = storyImageUrlsRaw
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  const parsed = postSchema.safeParse({
    ...raw,
    story_image_urls: storyImageUrls,
    tournament_id: raw.tournament_id || null,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  // Auto-format Canva URL
  let canvaUrl = parsed.data.canva_embed_url
  if (canvaUrl && canvaUrl.includes('canva.com') && canvaUrl.includes('/view') && !canvaUrl.includes('?embed')) {
    try {
      const urlObj = new URL(canvaUrl)
      canvaUrl = `${urlObj.origin}${urlObj.pathname}?embed`
    } catch (e) {
      // Ignore invalid URL formatting
    }
  }

  const insertData: any = {
    ...parsed.data,
    canva_embed_url: canvaUrl,
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
  const storyImageUrlsRaw = String(raw.story_image_urls || '')
  const storyImageUrls = storyImageUrlsRaw
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  const parsed = postSchema.safeParse({
    ...raw,
    story_image_urls: storyImageUrls,
    tournament_id: raw.tournament_id || null,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  // Auto-format Canva URL
  let canvaUrl = parsed.data.canva_embed_url
  if (canvaUrl && canvaUrl.includes('canva.com') && canvaUrl.includes('/view') && !canvaUrl.includes('?embed')) {
    try {
      const urlObj = new URL(canvaUrl)
      canvaUrl = `${urlObj.origin}${urlObj.pathname}?embed`
    } catch (e) {
      // Ignore invalid URL formatting
    }
  }

  const updateData: any = { 
    ...parsed.data,
    canva_embed_url: canvaUrl
  }
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
