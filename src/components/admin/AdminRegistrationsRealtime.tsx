'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeTable } from '@/hooks/useRealtimeTable'
import { useNotificationSound } from '@/hooks/useNotificationSound'
import { toast } from 'sonner'
import { Loader2, Sparkles, RefreshCw, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending_payment: 'bg-yellow-100 text-yellow-700',
  registered: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  rejected: 'bg-red-100 text-red-600',
}

const statusLabels: Record<string, string> = {
  draft: 'Nháp',
  pending_payment: 'Chờ TT',
  registered: 'Đã ĐK',
  confirmed: 'Đã XN',
  cancelled: 'Đã hủy',
  rejected: 'Từ chối',
}

export function AdminRegistrationsRealtime() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'all'
  const tournamentFilter = searchParams.get('tournament') || ''
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set())
  const { play: playSound } = useNotificationSound()

  const fetchRegistrations = async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('registrations')
      .select('*, tournament:tournaments(title, slug), category:tournament_categories(name)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }
    if (tournamentFilter) {
      query = query.eq('tournament_id', tournamentFilter)
    }

    const { data } = await query
    setRegistrations(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchRegistrations()
  }, [statusFilter, tournamentFilter])

  const highlightRow = (id: string) => {
    setHighlightIds((prev) => new Set(prev).add(id))
    setTimeout(() => {
      setHighlightIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 4000)
  }

  const fetchSingle = async (id: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('registrations')
      .select('*, tournament:tournaments(title, slug), category:tournament_categories(name)')
      .eq('id', id)
      .single()
    return data
  }

  // 🔴 REALTIME
  useRealtimeTable({
    table: 'registrations',
    onInsert: async (payload) => {
      const newRow = payload.new as any
      const full = await fetchSingle(newRow.id)
      if (full) {
        setRegistrations((prev) => {
          if (prev.some((r) => r.id === full.id)) return prev
          if (statusFilter !== 'all' && full.status !== statusFilter) return prev
          return [full, ...prev]
        })
        highlightRow(full.id)
        toast.info(`📋 Đăng ký mới: ${full.full_name}`, { duration: 4000 })
      }
    },
    onUpdate: async (payload) => {
      const newRow = payload.new as any
      const oldRow = payload.old as any
      const full = await fetchSingle(newRow.id)
      if (!full) return

      setRegistrations((prev) => {
        if (statusFilter !== 'all' && full.status !== statusFilter) {
          return prev.filter((r) => r.id !== full.id)
        }
        const idx = prev.findIndex((r) => r.id === full.id)
        if (idx >= 0) {
          const updated = [...prev]
          updated[idx] = full
          return updated
        }
        return [full, ...prev]
      })

      if (newRow.status === 'registered' && oldRow.status !== 'registered') {
        playSound()
        highlightRow(newRow.id)
        toast.success(`✅ ${newRow.full_name} đã thanh toán thành công!`, { duration: 5000 })
      } else {
        highlightRow(newRow.id)
      }
    },
    onDelete: (payload) => {
      const oldRow = payload.old as any
      setRegistrations((prev) => prev.filter((r) => r.id !== oldRow.id))
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">Quản lý đăng ký</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/30 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              REALTIME
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{registrations.length} đơn đăng ký</p>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchRegistrations} title="Tải lại">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending_payment', 'registered', 'confirmed', 'cancelled', 'rejected'].map((s) => (
          <Link
            key={s}
            href={`/admin/dang-ky${s === 'all' ? '' : `?status=${s}`}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              (statusFilter || 'all') === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {s === 'all' ? 'Tất cả' : statusLabels[s] || s}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/30 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Họ tên</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Giải đấu</th>
                  <th className="px-4 py-3 hidden md:table-cell">Hạng mục</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 hidden md:table-cell">Thanh toán</th>
                  <th className="px-4 py-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      Chưa có đơn đăng ký.
                    </td>
                  </tr>
                ) : (
                  registrations.map((r: any) => (
                    <tr
                      key={r.id}
                      className={`border-b border-border/40 transition-all duration-700 ${
                        highlightIds.has(r.id)
                          ? 'bg-green-50 dark:bg-green-950/20 ring-1 ring-inset ring-green-200 dark:ring-green-800'
                          : 'hover:bg-secondary/20'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs">{r.registration_code}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium">{r.full_name}</p>
                            <p className="text-xs text-muted-foreground">{r.email}</p>
                          </div>
                          {highlightIds.has(r.id) && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 text-[9px] font-bold text-green-700 dark:text-green-400 animate-pulse shrink-0">
                              <Sparkles className="h-2.5 w-2.5" />
                              MỚI
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground max-w-[150px] truncate">
                        {(r.tournament as any)?.title || '—'}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs">
                        {(r.category as any)?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[r.status] || ''}`}>
                          {statusLabels[r.status] || r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs">
                        {r.amount_due > 0 ? `${(r.amount_paid || 0).toLocaleString('vi-VN')}/${r.amount_due.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/dang-ky/${r.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
