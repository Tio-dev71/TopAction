import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip Supabase if env vars are not configured
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // IMPORTANT: DO NOT run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-site tracking.
  const { data: { user } } = await supabase.auth.getUser()

  // Define routes that require authentication
  const protectedRoutes = ['/ca-nhan', '/thanh-toan', '/dang-ky-giai']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/dang-nhap', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect away from auth pages if already logged in
  const authRoutes = ['/dang-nhap', '/dang-ky', '/quen-mat-khau']
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}
