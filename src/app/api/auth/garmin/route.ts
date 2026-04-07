import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchGarminRequestToken, GARMIN_API } from '@/lib/garmin/client'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/dang-nhap', request.url))
  }

  // If missing Garmin keys, simulate a block UI or mock mode.
  if (!process.env.GARMIN_CONSUMER_KEY || process.env.GARMIN_CONSUMER_KEY === '') {
    return NextResponse.redirect(new URL('/ca-nhan?error=missing_garmin_keys', request.url))
  }

  try {
    // 1. Get Request Token
    const { oauth_token, oauth_token_secret } = await fetchGarminRequestToken()

    // 2. Save secret to cookie so callback can use it to sign the token exchange
    const cookieStore = await cookies()
    cookieStore.set('garmin_tmp_secret', oauth_token_secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15, // 15 mins
      path: '/api/auth/garmin/callback',
    })

    // 3. Redirect to Garmin verification page
    // Needs oauth_token and oauth_callback
    const callbackUrl = new URL('/api/auth/garmin/callback', request.url).toString()
    const redirectUrl = `${GARMIN_API.authorizeUrl}?oauth_token=${oauth_token}&oauth_callback=${encodeURIComponent(callbackUrl)}`

    return NextResponse.redirect(redirectUrl)
  } catch (err: any) {
    console.error('Garmin OAuth error:', err)
    return NextResponse.redirect(new URL('/ca-nhan?error=garmin_oauth_failed', request.url))
  }
}
