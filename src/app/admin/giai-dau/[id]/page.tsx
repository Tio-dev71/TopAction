import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pencil, Globe, Archive, XCircle } from 'lucide-react'
import { TournamentStatusActions } from './StatusActions'

export default async function AdminTournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from('tournaments')
    .select(`
      *,
      categories:tournament_categories(*),
      rules:tournament_rules(*),
      organizers:organizers(*)
    `)
    .eq('id', id)
    .single()

  if (!tournament) notFound()

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    closed: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-red-100 text-red-600',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/giai-dau">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h2 className="text-lg font-bold">{tournament.title}</h2>
            <p className="text-xs text-muted-foreground">/{tournament.slug}</p>
          </div>
          <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[tournament.status]}`}>
            {tournament.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TournamentStatusActions id={tournament.id} currentStatus={tournament.status} />
          <Link href={`/admin/giai-dau/${id}/edit`}>
            <Button className="gap-2">
              <Pencil className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard label="Tham gia" value={`${tournament.participant_count}${tournament.max_participants ? `/${tournament.max_participants}` : ''}`} />
        <InfoCard label="Ủng hộ" value={`${(tournament.donation_total || 0).toLocaleString('vi-VN')} ₫`} />
        <InfoCard label="Thể loại" value={tournament.category || '—'} />
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h3 className="mb-4 text-sm font-bold">Hạng mục thi đấu ({tournament.categories?.length || 0})</h3>
        {tournament.categories && tournament.categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-4">Tên</th>
                  <th className="pb-2 pr-4">Cự ly</th>
                  <th className="pb-2 pr-4">Giá</th>
                  <th className="pb-2 pr-4">Sức chứa</th>
                  <th className="pb-2">Đã ĐK</th>
                </tr>
              </thead>
              <tbody>
                {tournament.categories.map((c: any) => (
                  <tr key={c.id} className="border-b border-border/40">
                    <td className="py-2 pr-4 font-medium">{c.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{c.distance || '—'}</td>
                    <td className="py-2 pr-4">{c.price > 0 ? `${c.price.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{c.capacity || '∞'}</td>
                    <td className="py-2">{c.registered_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có hạng mục. Thêm trong phần chỉnh sửa.</p>
        )}
      </div>

      {/* Rules */}
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h3 className="mb-4 text-sm font-bold">Quy định ({tournament.rules?.length || 0})</h3>
        {tournament.rules && tournament.rules.length > 0 ? (
          <div className="space-y-2">
            {tournament.rules.map((rule: any) => (
              <div key={rule.id} className="rounded-lg bg-secondary/30 p-3">
                <p className="text-sm font-medium">{rule.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{rule.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có quy định.</p>
        )}
      </div>

      {/* Organizers */}
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h3 className="mb-4 text-sm font-bold">Đơn vị tổ chức ({tournament.organizers?.length || 0})</h3>
        {tournament.organizers && tournament.organizers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {tournament.organizers.map((org: any) => (
              <div key={org.id} className="rounded-lg border border-border/40 p-3">
                <p className="text-sm font-medium">{org.name}</p>
                <p className="text-xs text-muted-foreground">{org.type} — {org.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có đơn vị tổ chức.</p>
        )}
      </div>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  )
}
