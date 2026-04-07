'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(state: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Bạn chưa đăng nhập.' }
  }

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const city = formData.get('city') as string
  const club_name = formData.get('club_name') as string

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name,
    phone,
    city,
    club_name,
    email: user.email 
  }, { onConflict: 'id', ignoreDuplicates: false })

  if (error) {
     return { error: 'Cập nhật thông tin thất bại.' }
  }

  revalidatePath('/ca-nhan')
  return { success: true }
}
