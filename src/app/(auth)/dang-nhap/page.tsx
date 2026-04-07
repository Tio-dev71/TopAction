"use client";

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Trophy, ArrowLeft, Loader2 } from 'lucide-react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirectParams = searchParams?.get('redirect')
  
  const router = useRouter()
  
  const loginWithRedirect = async (prevState: any, formData: FormData) => {
      if (redirectParams) {
          formData.append('target', redirectParams)
      }
      return await login(prevState, formData)
  }

  const [state, formAction, pending] = useActionState(loginWithRedirect, null)

  useEffect(() => {
    if (state?.error) {
      // In case we want to trigger error toast as well, but we show it inline below
    }
    if (state?.success && state.redirect) {
      toast.success("Đăng nhập thành công!")
      router.push(state.redirect)
    }
  }, [state, router])

  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      toast.error("Tính năng đăng nhập bằng Google hiện đang bảo trì.")
      return
    }

    setGoogleLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback${redirectParams ? '?next=' + encodeURIComponent(redirectParams) : ''}`,
        },
      })
      
      if (error) {
        toast.error(error.message)
        setGoogleLoading(false)
      }
    } catch (e) {
      toast.error("Không thể khởi tạo đăng nhập Google.")
      setGoogleLoading(false)
    }
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
              <Trophy className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-primary">A</span>TUAN
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Đăng nhập
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hoặc{" "}
            <Link href="/dang-ky" className="font-medium text-primary hover:text-primary/80 transition-colors">
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        <Card className="border-border/60 shadow-lg shadow-primary/5">
          <CardContent className="pt-6">
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive text-center">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link href="/quen-mat-khau" className="text-xs font-medium text-primary hover:text-primary/80">
                    Quên mật khẩu?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="bg-background"
                />
              </div>

              <Button type="submit" className="w-full shadow-md shadow-primary/20" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Hoặc tiếp tục với</span>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline" 
              className="mt-6 w-full gap-2" 
              onClick={handleGoogleSignIn} 
              disabled={pending || googleLoading}
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
              )}
              Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/60 p-4">
               <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Về trang chủ
               </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
