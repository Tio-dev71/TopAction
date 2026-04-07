export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Cài đặt hệ thống</h2>
        <p className="text-sm text-muted-foreground">Quản lý cấu hình nền tảng</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-sm font-bold mb-2">Payment Provider</h3>
          <p className="text-xs text-muted-foreground">
            Provider hiện tại: <span className="font-mono">{process.env.PAYMENT_PROVIDER || 'vnpay'}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Mode: {process.env.VNPAY_URL?.includes('sandbox') ? '🧪 Sandbox' : '🟢 Production'}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-sm font-bold mb-2">Email Provider</h3>
          <p className="text-xs text-muted-foreground">
            Provider: Console (Development)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Chuyển sang Resend/SendGrid trong production.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-sm font-bold mb-2">Supabase</h3>
          <p className="text-xs text-muted-foreground">
            URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Service Key: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configured' : '❌ Missing'}
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-sm font-bold mb-2">Environment</h3>
          <p className="text-xs text-muted-foreground">
            Mode: {process.env.NODE_ENV}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            App URL: {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}
          </p>
        </div>
      </div>
    </div>
  )
}
