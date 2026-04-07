'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { profileSchema } from '@/lib/validations/schemas'

export async function updateProfile(state: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Bạn chưa đăng nhập.' }
  }

  const raw = Object.fromEntries(formData)
  const parsed = profileSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.issues.map(e => e.message).join(', ') }
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    ...parsed.data,
    // Convert empty strings to null for optional fields
    phone: parsed.data.phone || null,
    birth_date: parsed.data.birth_date || null,
    gender: parsed.data.gender || null,
    city: parsed.data.city || null,
    club_name: parsed.data.club_name || null,
    emergency_contact: parsed.data.emergency_contact || null,
  }, { onConflict: 'id', ignoreDuplicates: false })

  if (error) {
     return { error: 'Cập nhật thông tin thất bại: ' + error.message }
  }

  revalidatePath('/ca-nhan')
  return { success: true }
}
