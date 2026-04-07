import { createClient } from '@/lib/supabase/server'
import { getPaymentProvider } from '@/lib/payments/create-payment'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, ArrowLeft, Home } from 'lucide-react'

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const provider = getPaymentProvider()

  // Verify the return URL
  const verifyResult = await provider.verifyReturn({ query: params })

  const supabase = await createClient()

  // Find the order
  let orderInfo: { title: string; type: string; code: string } | null = null

  if (params.type === 'registration') {
    const { data: reg } = await supabase
      .from('registrations')
      .select('registration_code, tournament:tournaments(title)')
      .eq('registration_code', params.code || verifyResult.orderId)
      .single()
    
    if (reg) {
      orderInfo = {
        title: (reg.tournament as any)?.title || '',
        type: 'Đăng ký tham gia',
        code: reg.registration_code,
      }
    }
  } else if (params.type === 'donation') {
    const { data: don } = await supabase
      .from('donations')
      .select('donation_code, tournament:tournaments(title)')
      .eq('donation_code', params.code || verifyResult.orderId)
      .single()
    
    if (don) {
      orderInfo = {
        title: (don.tournament as any)?.title || '',
        type: 'Ủng hộ',
        code: don.donation_code,
      }
    }
  }

  const isSuccess = verifyResult.success && verifyResult.status === 'success'
  const isCancelled = verifyResult.status === 'cancelled'

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${
          isSuccess ? 'bg-green-100' : isCancelled ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          {isSuccess ? (
            <CheckCircle className="h-10 w-10 text-green-600" />
          ) : isCancelled ? (
            <Clock className="h-10 w-10 text-yellow-600" />
          ) : (
            <XCircle className="h-10 w-10 text-red-600" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold tracking-tight">
          {isSuccess ? 'Thanh toán thành công!' : isCancelled ? 'Đã hủy giao dịch' : 'Thanh toán thất bại'}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {isSuccess
            ? 'Giao dịch của bạn đã được xác nhận.'
            : isCancelled
            ? 'Bạn đã hủy giao dịch. Đơn vẫn ở trạng thái chờ thanh toán.'
            : 'Có lỗi xảy ra trong quá trình thanh toán.'}
        </p>

        {/* Order info */}
        {orderInfo && (
          <div className={`mt-6 rounded-xl border p-4 text-left ${
            isSuccess ? 'border-green-200 bg-green-50' : 'border-border/60 bg-card'
          }`}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại:</span>
                <span className="font-medium">{orderInfo.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giải đấu:</span>
                <span className="font-medium">{orderInfo.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã:</span>
                <span className="font-mono font-bold">{orderInfo.code}</span>
              </div>
              {verifyResult.amount > 0 && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Số tiền:</span>
                  <span className="font-bold text-primary">{verifyResult.amount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/ca-nhan">
            <Button className="w-full gap-2 sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Trang cá nhân
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <Home className="h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
