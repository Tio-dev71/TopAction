import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/ca-nhan'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Sync the profile after a successful OAuth exchange
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert(
          {
             id: user.id,
             email: user.email as string,
             full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
             avatar_url: user.user_metadata?.avatar_url || '',
          },
          { onConflict: 'id', ignoreDuplicates: true }
        )
      }

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/dang-nhap?error=auth_callback_failed`)
}
