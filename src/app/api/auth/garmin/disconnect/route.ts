import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/dang-nhap?error=auth_required`)
  }

  const { error } = await supabase
    .from('user_connections')
    .delete()
    .eq('user_id', user.id)
    .eq('provider', 'garmin')

  if (error) {
    console.error('Failed to disconnect Garmin:', error)
    return NextResponse.redirect(`${origin}/ca-nhan?error=garmin_disconnect_failed`)
  }

  return NextResponse.redirect(`${origin}/ca-nhan?success=garmin_disconnected`)
}
