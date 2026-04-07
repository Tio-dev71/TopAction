import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/dang-nhap?error=auth_required`)
  }

  // Find and remove connection
  const { error } = await supabase
    .from('user_connections')
    .delete()
    .eq('user_id', user.id)
    .eq('provider', 'strava')

  if (error) {
    console.error('Failed to disconnect Strava:', error)
    return NextResponse.redirect(`${origin}/ca-nhan?error=strava_disconnect_failed`)
  }

  // Also might want to clean up tournament results or activities? 
  // Normally when unlinking, past activities might remain, or be removed. 
  // Let's just remove the connection for now.

  return NextResponse.redirect(`${origin}/ca-nhan?success=strava_disconnected`)
}
