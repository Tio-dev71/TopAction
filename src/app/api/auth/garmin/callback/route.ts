import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchGarminAccessToken } from '@/lib/garmin/client'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const oauthToken = searchParams.get('oauth_token')
  const oauthVerifier = searchParams.get('oauth_verifier')

  if (!oauthToken || !oauthVerifier) {
    return NextResponse.redirect(`${origin}/ca-nhan?error=garmin_callback_invalid`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/dang-nhap?error=auth_required`)
  }

  try {
    // Retrieve the temporary secret from cookie
    const cookieStore = await cookies()
    const requestSecret = cookieStore.get('garmin_tmp_secret')?.value || ''

    // Clear the cookie
    cookieStore.delete('garmin_tmp_secret')

    if (!requestSecret) {
      return NextResponse.redirect(`${origin}/ca-nhan?error=garmin_session_expired`)
    }

    // Exchange for Access Token
    const { oauth_token: accessToken, oauth_token_secret: accessSecret } =
      await fetchGarminAccessToken(oauthToken, requestSecret, oauthVerifier)

    // Save to user_connections (same table as Strava)
    const { error: upsertError } = await supabase
      .from('user_connections')
      .upsert({
        user_id: user.id,
        provider: 'garmin',
        provider_athlete_id: accessToken, // Garmin doesn't give a separate user ID in OAuth1 flow
        access_token: accessToken,
        refresh_token: accessSecret, // In OAuth1, this is the token secret
        expires_at: null, // OAuth1 tokens don't expire
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id, provider' })

    if (upsertError) {
      console.error('Failed to save Garmin connection:', upsertError)
      return NextResponse.redirect(`${origin}/ca-nhan?error=garmin_save_failed`)
    }

    return NextResponse.redirect(`${origin}/ca-nhan?success=garmin_connected`)
  } catch (err) {
    console.error('Garmin callback error:', err)
    return NextResponse.redirect(`${origin}/ca-nhan?error=garmin_exchange_error`)
  }
}
