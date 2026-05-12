import { NextResponse } from 'next/server'
import { getStravaAuthUrl } from '@/lib/strava/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // Extract redirect url from request if any, else default to /ca-nhan
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get('next') || '/ca-nhan'

  // We should verify the user is logged in before they connect to Strava
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/dang-nhap?redirect=/ca-nhan&error=auth_required`)
  }

  // Generate the callback URL registered in Strava.
  // Prefer the configured public app URL because Strava validates the exact
  // callback host; request.origin can be a preview/proxy host in mobile webviews.
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
  const callbackOrigin = configuredAppUrl || origin
  const redirectUri = `${callbackOrigin}/api/auth/strava/callback`

  console.log('[Strava Debug]', {
    origin,
    configuredAppUrl,
    callbackOrigin,
    redirectUri,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
  })

  try {
    const authUrl = getStravaAuthUrl(redirectUri)
    // We append the internal next redirect path as state so we know where to go back to
    const authUrlWithState = `${authUrl}&state=${encodeURIComponent(next)}`
    return NextResponse.redirect(authUrlWithState)
  } catch (error: any) {
    console.error('Strava Auth Error:', error.message)
    return NextResponse.redirect(`${origin}${next}?error=strava_config_missing`)
  }
}
