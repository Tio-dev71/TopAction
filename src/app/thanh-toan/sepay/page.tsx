import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCw, QrCode } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Footer } from '@/components/layout/Footer'

export default async function SePayCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const code = params.code || ''
  const amount = params.amount || '0'
  const type = params.type || 'registration'

  const bankId = process.env.NEXT_PUBLIC_BANK_ID || 'MB'
  const accountNo = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO || ''
  const accountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || ''
  
  // Create a VietQR image via SePay or VietQR
  const qrUrl = accountNo 
    ? `https://qr.sepay.vn/img?bank=${bankId}&acc=${accountNo}&amount=${amount}&des=${code}`
    : ''

  const amountStr = parseInt(amount).toLocaleString('vi-VN')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/ca-nhan">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang cá nhân
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden border-border/60 shadow-xl shadow-primary/5">
          <div className="bg-primary p-4 text-center text-primary-foreground">
            <QrCode className="mx-auto mb-2 h-10 w-10 opacity-80" />
            <h1 className="text-xl font-bold">Thanh toán chuyển khoản</h1>
            <p className="text-sm opacity-90">Quét mã QR qua ứng dụng ngân hàng</p>
          </div>

          <CardContent className="p-6">
            <div className="mb-6 space-y-4 rounded-xl border border-border/50 bg-secondary/20 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngân hàng:</span>
                <span className="font-bold">{bankId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số tài khoản:</span>
                <span className="font-bold text-foreground">{accountNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chủ tài khoản:</span>
                <span className="font-bold">{accountName}</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-4">
                <span className="text-muted-foreground">Số tiền:</span>
                <span className="text-lg font-bold text-primary">{amountStr} ₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nội dung (Bắt buộc):</span>
                <span className="bg-yellow-100 px-2 py-0.5 rounded font-mono font-bold text-yellow-800">{code}</span>
              </div>
            </div>

            {qrUrl ? (
              <div className="text-center">
                <div className="relative mx-auto mb-2 inline-block rounded-2xl border-4 border-white shadow-md">
                  <img src={qrUrl} alt="VietQR Code" className="h-64 w-64 rounded-xl object-contain bg-white" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Mở ứng dụng ngân hàng bất kỳ để quét mã
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
                Chưa cấu hình tài khoản ngân hàng (NEXT_PUBLIC_BANK_ACCOUNT_NO)
              </div>
            )}
            
            <div className="mt-6 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
              <span className="font-bold">Lưu ý:</span> Hệ thống sẽ tự động xác nhận Giao dịch trong vòng 1-3 phút. Bạn không cần làm gì thêm sau khi chuyển tiền thành công.
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/40 p-4">
            <Link href={`/thanh-toan/ket-qua?type=${type}&code=${code}`} className="w-full">
              <Button variant="outline" className="w-full gap-2 text-primary border-primary/20 hover:bg-primary/10">
                <RefreshCw className="h-4 w-4" />
                Tôi đã chuyển khoản xong
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
