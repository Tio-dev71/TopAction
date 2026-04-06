import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function hasSession() {
  const supabase = await createClient()
  
  try {
    const { data } = await supabase.auth.getSession()
    return !!data.session
  } catch (e) {
    return false
  }
}
