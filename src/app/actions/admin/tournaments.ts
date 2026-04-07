'use server'

import { createClient } from '@/lib/supabase/server'
import { requireStaff, requireAdmin } from '@/lib/auth/permissions'
import { createAuditLog } from '@/lib/audit'
import { tournamentSchema, tournamentCategorySchema, tournamentRuleSchema } from '@/lib/validations/schemas'
import { revalidatePath } from 'next/cache'

export async function getTournaments(filters?: { status?: string; search?: string }) {
  const { user } = await requireStaff()
  const supabase = await createClient()

  let query = supabase
    .from('tournaments')
    .select('*, categories:tournament_categories(count)')
    .order('created_at', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data || []
}

export async function getTournamentById(id: string) {
  await requireStaff()
  const supabase = await createClient()

  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      categories:tournament_categories(*),
      rules:tournament_rules(*),
      sections:tournament_sections(*),
      organizers:organizers(*)
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return tournament
}

export async function createTournament(prevState: any, formData: FormData) {
  const { user } = await requireStaff()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData)
  
  const fixTz = (val: any) => (typeof val === 'string' && val.length === 16 && val.includes('T')) ? `${val}:00+07:00` : (val || null)

  const parsed = tournamentSchema.safeParse({
    ...raw,
    is_featured: raw.is_featured === 'true',
    max_participants: raw.max_participants ? parseInt(raw.max_participants as string) : null,
    registration_open_at: fixTz(raw.registration_open_at),
    registration_close_at: fixTz(raw.registration_close_at),
    valid_activity_types: formData.getAll('valid_activity_types').length ? formData.getAll('valid_activity_types') : ['Run'],
    min_pace: raw.min_pace ? parseInt(raw.min_pace as string) : 240,
    max_pace: raw.max_pace ? parseInt(raw.max_pace as string) : 900,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  const { data, error } = await supabase
    .from('tournaments')
    .insert({
      ...parsed.data,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Slug đã tồn tại. Vui lòng chọn slug khác.' }
    return { error: 'Không thể tạo giải đấu: ' + error.message }
  }

  await createAuditLog({
    action: 'tournament.create',
    target_table: 'tournaments',
    target_id: data.id,
    metadata: { title: parsed.data.title },
  })

  revalidatePath('/admin/giai-dau')
  return { success: true, id: data.id }
}

export async function updateTournament(id: string, prevState: any, formData: FormData) {
  await requireStaff()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData)
  
  const fixTz = (val: any) => (typeof val === 'string' && val.length === 16 && val.includes('T')) ? `${val}:00+07:00` : (val || null)

  const parsed = tournamentSchema.safeParse({
    ...raw,
    is_featured: raw.is_featured === 'true',
    max_participants: raw.max_participants ? parseInt(raw.max_participants as string) : null,
    registration_open_at: fixTz(raw.registration_open_at),
    registration_close_at: fixTz(raw.registration_close_at),
    valid_activity_types: formData.getAll('valid_activity_types').length ? formData.getAll('valid_activity_types') : ['Run'],
    min_pace: raw.min_pace ? parseInt(raw.min_pace as string) : 240,
    max_pace: raw.max_pace ? parseInt(raw.max_pace as string) : 900,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  const { error } = await supabase
    .from('tournaments')
    .update(parsed.data)
    .eq('id', id)

  if (error) {
    if (error.code === '23505') return { error: 'Slug đã tồn tại.' }
    return { error: 'Không thể cập nhật: ' + error.message }
  }

  await createAuditLog({
    action: 'tournament.update',
    target_table: 'tournaments',
    target_id: id,
    metadata: { title: parsed.data.title },
  })

  revalidatePath('/admin/giai-dau')
  revalidatePath(`/admin/giai-dau/${id}`)
  revalidatePath(`/giai-dau/${parsed.data.slug}`)
  return { success: true }
}

export async function updateTournamentStatus(id: string, status: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('tournaments')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }

  await createAuditLog({
    action: `tournament.${status}`,
    target_table: 'tournaments',
    target_id: id,
    metadata: { status },
  })

  revalidatePath('/admin/giai-dau')
  revalidatePath(`/admin/giai-dau/${id}`)
  revalidatePath('/')
  return { success: true }
}

export async function deleteTournament(id: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  await createAuditLog({
    action: 'tournament.delete',
    target_table: 'tournaments',
    target_id: id,
  })

  revalidatePath('/admin/giai-dau')
  return { success: true }
}

// ---- Categories ----

export async function saveTournamentCategory(tournamentId: string, prevState: any, formData: FormData) {
  await requireStaff()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData)
  const catId = raw.id as string | undefined
  
  const parsed = tournamentCategorySchema.safeParse({
    name: raw.name,
    distance: raw.distance,
    price: parseInt(raw.price as string) || 0,
    capacity: raw.capacity ? parseInt(raw.capacity as string) : null,
    sort_order: parseInt(raw.sort_order as string) || 0,
    is_active: raw.is_active === 'true',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  if (catId) {
    const { error } = await supabase
      .from('tournament_categories')
      .update(parsed.data)
      .eq('id', catId)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('tournament_categories')
      .insert({ ...parsed.data, tournament_id: tournamentId })
    if (error) return { error: error.message }
  }

  revalidatePath(`/admin/giai-dau/${tournamentId}`)
  return { success: true }
}

export async function deleteTournamentCategory(categoryId: string, tournamentId: string) {
  await requireStaff()
  const supabase = await createClient()

  const { error } = await supabase
    .from('tournament_categories')
    .delete()
    .eq('id', categoryId)

  if (error) return { error: error.message }

  revalidatePath(`/admin/giai-dau/${tournamentId}`)
  return { success: true }
}

// ---- Rules ----

export async function saveTournamentRule(tournamentId: string, prevState: any, formData: FormData) {
  await requireStaff()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData)
  const ruleId = raw.id as string | undefined

  const parsed = tournamentRuleSchema.safeParse({
    rule_type: raw.rule_type,
    title: raw.title,
    content: raw.content,
    icon: raw.icon,
    sort_order: parseInt(raw.sort_order as string) || 0,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  if (ruleId) {
    const { error } = await supabase
      .from('tournament_rules')
      .update(parsed.data)
      .eq('id', ruleId)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('tournament_rules')
      .insert({ ...parsed.data, tournament_id: tournamentId })
    if (error) return { error: error.message }
  }

  revalidatePath(`/admin/giai-dau/${tournamentId}`)
  return { success: true }
}

// ---- Organizers ----

export async function saveOrganizer(tournamentId: string, prevState: any, formData: FormData) {
  await requireStaff()
  const supabase = await createClient()

  const raw = Object.fromEntries(formData)
  const orgId = raw.id as string | undefined

  const orgData = {
    name: raw.name as string,
    description: (raw.description as string) || null,
    logo_url: (raw.logo_url as string) || null,
    type: (raw.type as string) || 'organizer',
    sort_order: parseInt(raw.sort_order as string) || 0,
  }

  if (orgId) {
    const { error } = await supabase
      .from('organizers')
      .update(orgData)
      .eq('id', orgId)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('organizers')
      .insert({ ...orgData, tournament_id: tournamentId })
    if (error) return { error: error.message }
  }

  revalidatePath(`/admin/giai-dau/${tournamentId}`)
  return { success: true }
}
