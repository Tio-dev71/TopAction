import { NextResponse } from 'next/server'
import { exchangeStravaCode } from '@/lib/strava/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state') || '/ca-nhan'

  if (error) {
    return NextResponse.redirect(`${origin}${state}?error=strava_auth_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}${state}?error=invalid_strava_callback`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/dang-nhap?error=auth_required`)
  }

  try {
    const tokenResponse = await exchangeStravaCode(code)
    
    const providerAthleteId = tokenResponse.athlete.id.toString()
    const accessToken = tokenResponse.access_token
    const refreshToken = tokenResponse.refresh_token
    const expiresAt = new Date(tokenResponse.expires_at * 1000).toISOString()

    // Save to user_connections
    const { error: upsertError } = await supabase
      .from('user_connections')
      .upsert({
        user_id: user.id,
        provider: 'strava',
        provider_athlete_id: providerAthleteId,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, provider' })

    if (upsertError) {
      console.error('Failed to save Strava connection:', upsertError)
      return NextResponse.redirect(`${origin}${state}?error=strava_save_failed`)
    }

    return NextResponse.redirect(`${origin}${state}?success=strava_connected`)
  } catch (err) {
    console.error('Strava API Error:', err)
    return NextResponse.redirect(`${origin}${state}?error=strava_exchange_error`)
  }
}
