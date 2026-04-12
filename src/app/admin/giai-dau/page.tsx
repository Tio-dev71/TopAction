import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Pencil } from 'lucide-react'
import { DeleteTournamentButton } from '@/components/admin/tournaments/DeleteTournamentButton'

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-700' },
  published: { label: 'Đã xuất bản', color: 'bg-green-100 text-green-700' },
  closed: { label: 'Đã đóng', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: 'Lưu trữ', color: 'bg-red-100 text-red-600' },
}

export default async function AdminTournamentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('tournaments')
    .select('*')
    .order('created_at', { ascending: false })

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  if (params.search) {
    query = query.ilike('title', `%${params.search}%`)
  }

  const { data: tournaments } = await query

  return (
    <div className="space-y-6">
      {/* Actions bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Danh sách giải đấu</h2>
          <p className="text-sm text-muted-foreground">{tournaments?.length || 0} giải đấu</p>
        </div>
        <Link href="/admin/giai-dau/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo giải đấu
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'draft', 'published', 'closed', 'archived'].map((s) => (
          <Link
            key={s}
            href={`/admin/giai-dau${s === 'all' ? '' : `?status=${s}`}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              (params.status || 'all') === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {s === 'all' ? 'Tất cả' : statusLabels[s]?.label || s}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/30 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Giải đấu</th>
                <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 hidden md:table-cell">Tham gia</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {(!tournaments || tournaments.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    Chưa có giải đấu nào.
                  </td>
                </tr>
              ) : (
                tournaments.map((t: any) => (
                  <tr key={t.id} className="border-b border-border/40 transition-colors hover:bg-secondary/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {t.cover_image && (
                          <img
                            src={t.cover_image}
                            alt=""
                            className="h-10 w-14 rounded-lg object-cover hidden sm:block"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[200px]">{t.title}</p>
                          <p className="text-xs text-muted-foreground">/{t.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {t.category || '—'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-semibold">{t.participant_count}</span>
                      {t.max_participants && (
                        <span className="text-muted-foreground">/{t.max_participants}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusLabels[t.status]?.color || ''}`}>
                        {statusLabels[t.status]?.label || t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/giai-dau/${t.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/giai-dau/${t.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteTournamentButton id={t.id} title={t.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
