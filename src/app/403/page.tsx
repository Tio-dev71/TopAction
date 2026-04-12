import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Không có quyền truy cập | TOPPLAY',
}

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">403</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Bạn không có quyền truy cập trang này.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
