import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { RegistrationActions } from './RegistrationActions'

export default async function AdminRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: reg } = await supabase
    .from('registrations')
    .select(`
      *,
      tournament:tournaments(title, slug),
      category:tournament_categories(name, distance, price),
      status_logs:registration_status_logs(*)
    `)
    .eq('id', id)
    .order('created_at', { referencedTable: 'registration_status_logs', ascending: false })
    .single()

  if (!reg) notFound()

  // Get payment transactions
  const { data: payments } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('registration_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/dang-ky">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h2 className="text-lg font-bold">Đơn đăng ký #{reg.registration_code}</h2>
          <p className="text-xs text-muted-foreground">{reg.full_name} — {(reg.tournament as any)?.title}</p>
        </div>
      </div>

      {/* Status Actions */}
      <RegistrationActions id={reg.id} currentStatus={reg.status} />

      {/* Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoBox label="Họ tên" value={reg.full_name} />
        <InfoBox label="Email" value={reg.email} />
        <InfoBox label="SĐT" value={reg.phone || '—'} />
        <InfoBox label="Giới tính" value={reg.gender || '—'} />
        <InfoBox label="Thành phố" value={reg.city || '—'} />
        <InfoBox label="CLB" value={reg.club_name || '—'} />
        <InfoBox label="Giải đấu" value={(reg.tournament as any)?.title || '—'} />
        <InfoBox label="Hạng mục" value={(reg.category as any)?.name || '—'} />
        <InfoBox label="Phí" value={reg.amount_due > 0 ? `${reg.amount_due.toLocaleString('vi-VN')} ₫` : 'Miễn phí'} />
        <InfoBox label="Đã TT" value={`${reg.amount_paid.toLocaleString('vi-VN')} ₫`} />
        <InfoBox label="Trạng thái ĐK" value={reg.status} />
        <InfoBox label="Trạng thái TT" value={reg.payment_status} />
        <InfoBox label="Ngày ĐK" value={new Date(reg.created_at).toLocaleDateString('vi-VN')} />
        {reg.note && <InfoBox label="Ghi chú" value={reg.note} />}
        {reg.emergency_contact && <InfoBox label="Liên hệ khẩn" value={reg.emergency_contact} />}
      </div>

      {/* Payment Transactions */}
      {payments && payments.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h3 className="mb-3 text-sm font-bold">Giao dịch thanh toán</h3>
          <div className="space-y-2">
            {payments.map((pt: any) => (
              <div key={pt.id} className="rounded-lg bg-secondary/30 p-3 text-sm">
                <div className="flex justify-between">
                  <span>{pt.provider} — {pt.status}</span>
                  <span className="font-bold">{pt.amount.toLocaleString('vi-VN')} ₫</span>
                </div>
                {pt.provider_transaction_id && (
                  <p className="text-xs text-muted-foreground mt-1">TX: {pt.provider_transaction_id}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status History */}
      {reg.status_logs && reg.status_logs.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <h3 className="mb-3 text-sm font-bold">Lịch sử trạng thái</h3>
          <div className="space-y-2">
            {reg.status_logs.map((log: any) => (
              <div key={log.id} className="flex items-center gap-3 text-sm">
                <span className="text-xs text-muted-foreground w-28 shrink-0">
                  {new Date(log.created_at).toLocaleDateString('vi-VN')}
                </span>
                <span className="text-muted-foreground">{log.old_status || '—'}</span>
                <span>→</span>
                <span className="font-medium">{log.new_status}</span>
                {log.note && <span className="text-xs text-muted-foreground">({log.note})</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  )
}
