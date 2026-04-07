'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeTable } from '@/hooks/useRealtimeTable'
import { useNotificationSound } from '@/hooks/useNotificationSound'
import { toast } from 'sonner'
import { Heart, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-600',
  refunded: 'bg-purple-100 text-purple-600',
}

const statusLabels: Record<string, string> = {
  pending: 'Chờ TT',
  paid: 'Đã TT',
  failed: 'Thất bại',
  cancelled: 'Đã hủy',
  refunded: 'Hoàn tiền',
}

function fmtMoney(n: number) {
  return n.toLocaleString('vi-VN') + ' ₫'
}

export function AdminDonationsRealtime() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'all'
  const [donations, setDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set())
  const [totalPaid, setTotalPaid] = useState(0)
  const { play: playSound } = useNotificationSound()

  // Initial load
  const fetchDonations = async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('donations')
      .select('*, tournament:tournaments(title)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data } = await query
    setDonations(data || [])

    // Calculate total paid
    const { data: paidData } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'paid')

    setTotalPaid((paidData || []).reduce((sum, d) => sum + (d.amount || 0), 0))
    setLoading(false)
  }

  useEffect(() => {
    fetchDonations()
  }, [statusFilter])

  // 🔴 REALTIME: Subscribe to ALL donations changes
  useRealtimeTable({
    table: 'donations',
    onInsert: (payload) => {
      const newRow = payload.new as any
      // We need to fetch with join to get tournament title
      fetchSingleDonation(newRow.id).then((full) => {
        if (full) {
          setDonations((prev) => {
            if (prev.some((d) => d.id === full.id)) return prev
            // If there's a filter, only add if it matches
            if (statusFilter !== 'all' && full.status !== statusFilter) return prev
            return [full, ...prev]
          })
          highlightRow(full.id)
        }
      })
    },
    onUpdate: (payload) => {
      const newRow = payload.new as any
      const oldRow = payload.old as any

      fetchSingleDonation(newRow.id).then((full) => {
        if (!full) return

        setDonations((prev) => {
          // If filter is active and new status doesn't match, remove it
          if (statusFilter !== 'all' && full.status !== statusFilter) {
            return prev.filter((d) => d.id !== full.id)
          }
          // Update or insert
          const exists = prev.findIndex((d) => d.id === full.id)
          if (exists >= 0) {
            const updated = [...prev]
            updated[exists] = full
            return updated
          }
          return [full, ...prev]
        })

        // Update total if status changed to paid
        if (newRow.status === 'paid' && oldRow.status !== 'paid') {
          setTotalPaid((prev) => prev + (newRow.amount || 0))
          highlightRow(newRow.id)
          playSound()
          toast.success(`💰 ${newRow.donor_name} đã thanh toán ${fmtMoney(newRow.amount)}!`, {
            duration: 5000,
          })
        }
        // If changed from paid to something else, subtract
        if (oldRow.status === 'paid' && newRow.status !== 'paid') {
          setTotalPaid((prev) => Math.max(0, prev - (oldRow.amount || 0)))
        }
      })
    },
    onDelete: (payload) => {
      const oldRow = payload.old as any
      setDonations((prev) => prev.filter((d) => d.id !== oldRow.id))
      if (oldRow.status === 'paid') {
        setTotalPaid((prev) => Math.max(0, prev - (oldRow.amount || 0)))
      }
    },
  })

  const fetchSingleDonation = async (id: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('donations')
      .select('*, tournament:tournaments(title)')
      .eq('id', id)
      .single()
    return data
  }

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">Quản lý ủng hộ</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/30 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              REALTIME
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{donations.length} lượt ủng hộ</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border/60 bg-card px-4 py-2 text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tổng đã thanh toán</p>
            <p className="text-lg font-extrabold text-primary">{fmtMoney(totalPaid)}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchDonations} title="Tải lại">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'paid', 'failed', 'cancelled', 'refunded'].map((s) => (
          <Link
            key={s}
            href={`/admin/ung-ho${s === 'all' ? '' : `?status=${s}`}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${(statusFilter || 'all') === s
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
          >
            {s === 'all' ? 'Tất cả' : statusLabels[s] || s}
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/30 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Người ủng hộ</th>
                <th className="px-4 py-3 hidden sm:table-cell">Giải đấu</th>
                <th className="px-4 py-3">Số tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 hidden md:table-cell">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Chưa có lượt ủng hộ.</td></tr>
              ) : (
                donations.map((d: any) => (
                  <tr
                    key={d.id}
                    className={`border-b border-border/40 transition-all duration-700 ${
                      highlightIds.has(d.id)
                        ? 'bg-green-50 dark:bg-green-950/20 ring-1 ring-inset ring-green-200 dark:ring-green-800'
                        : 'hover:bg-secondary/20'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{d.donation_code}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium">{d.is_anonymous ? 'Ẩn danh' : d.donor_name}</p>
                          <p className="text-xs text-muted-foreground">{d.email || '—'}</p>
                        </div>
                        {highlightIds.has(d.id) && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 text-[9px] font-bold text-green-700 dark:text-green-400 animate-pulse shrink-0">
                            <Sparkles className="h-2.5 w-2.5" />
                            MỚI
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground max-w-[150px] truncate">
                      {(d.tournament as any)?.title || '—'}
                    </td>
                    <td className="px-4 py-3 font-bold text-primary">{fmtMoney(d.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[d.status] || ''}`}>
                        {statusLabels[d.status] || d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                      {new Date(d.created_at).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
