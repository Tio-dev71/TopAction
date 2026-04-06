"use client";

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Trophy, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setPending(true)
      setError(null)

      // Simulate network
      await new Promise(r => setTimeout(r, 1000))

      // Mock success unconditionally
      setSuccess(true)
      setPending(false)
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
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
             Vui lòng nhập email đăng ký để nhận liên kết đặt lại mật khẩu.
          </p>
        </div>

        <Card className="border-border/60 shadow-lg shadow-primary/5">
          <CardContent className="pt-6">
            {success ? (
                <div className="rounded-lg bg-green-500/10 p-4 text-center">
                    <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        Chúng tôi đã gửi một email đặt lại mật khẩu đến <strong>{email}</strong>. 
                        Vui lòng kiểm tra hộp thư đến thư của bạn.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive text-center">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email đăng ký</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="bg-background"
                    />
                  </div>

                  <Button type="submit" className="w-full shadow-md shadow-primary/20" disabled={pending}>
                    {pending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi liên kết"
                    )}
                  </Button>
                </form>
            )}
          </CardContent>
           <CardFooter className="flex justify-center border-t border-border/60 p-4">
               <Link href="/dang-nhap" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
               </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
