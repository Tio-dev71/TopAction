'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeTable } from '@/hooks/useRealtimeTable'
import { useNotificationSound } from '@/hooks/useNotificationSound'
import { toast } from 'sonner'
import {
  Trophy, ClipboardList, Heart, Users, DollarSign,
  Loader2, Sparkles,
} from 'lucide-react'

function StatsCard({ label, value, icon: Icon, href, color, pulse }: {
  label: string
  value: string | number
  icon: any
  href: string
  color: string
  pulse?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        pulse ? 'ring-2 ring-primary/30 scale-[1.02]' : ''
      }`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-2xl font-extrabold tracking-tight transition-all duration-500 ${
          pulse ? 'scale-110 text-primary' : ''
        }`}>{value}</p>
      </div>
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    pending_payment: 'bg-yellow-100 text-yellow-700',
    registered: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    paid: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
    rejected: 'bg-red-100 text-red-600',
    failed: 'bg-red-100 text-red-600',
  }

  const labels: Record<string, string> = {
    draft: 'Nháp',
    pending: 'Chờ xử lý',
    pending_payment: 'Chờ TT',
    registered: 'Đã ĐK',
    confirmed: 'Đã XN',
    paid: 'Đã TT',
    cancelled: 'Đã hủy',
    rejected: 'Từ chối',
    failed: 'Thất bại',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  )
}

export function AdminDashboardRealtime() {
  const [stats, setStats] = useState({
    tournaments: 0,
    registrations: 0,
    donations: 0,
    users: 0,
    totalDonationAmount: 0,
  })
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([])
  const [recentDonations, setRecentDonations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pulseCard, setPulseCard] = useState<string | null>(null)
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set())
  const { play: playSound } = useNotificationSound()

  // Initial load
  const fetchAll = async () => {
    const supabase = createClient()

    const [
      { count: tournamentCount },
      { count: registrationCount },
      { count: donationCount },
      { count: userCount },
    ] = await Promise.all([
      supabase.from('tournaments').select('*', { count: 'exact', head: true }),
      supabase.from('registrations').select('*', { count: 'exact', head: true }),
      supabase.from('donations').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])

    const { data: donationTotal } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'paid')

    const totalDonationAmount = (donationTotal || []).reduce((sum, d) => sum + (d.amount || 0), 0)

    const { data: recentRegs } = await supabase
      .from('registrations')
      .select('id, full_name, email, status, payment_status, created_at, tournament:tournaments(title)')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentDons } = await supabase
      .from('donations')
      .select('id, donor_name, amount, status, created_at, tournament:tournaments(title)')
      .order('created_at', { ascending: false })
      .limit(5)

    setStats({
      tournaments: tournamentCount ?? 0,
      registrations: registrationCount ?? 0,
      donations: donationCount ?? 0,
      users: userCount ?? 0,
      totalDonationAmount,
    })
    setRecentRegistrations(recentRegs || [])
    setRecentDonations(recentDons || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])

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

  const pulseCardEffect = (card: string) => {
    setPulseCard(card)
    setTimeout(() => setPulseCard(null), 2000)
  }

  // 🔴 REALTIME: Listen for new/updated registrations
  useRealtimeTable({
    table: 'registrations',
    onInsert: async (payload) => {
      const newRow = payload.new as any
      setStats((prev) => ({ ...prev, registrations: prev.registrations + 1 }))
      pulseCardEffect('registrations')

      // Fetch with join
      const supabase = createClient()
      const { data } = await supabase
        .from('registrations')
        .select('id, full_name, email, status, payment_status, created_at, tournament:tournaments(title)')
        .eq('id', newRow.id)
        .single()

      if (data) {
        setRecentRegistrations((prev) => [data, ...prev.slice(0, 4)])
        highlightRow(data.id)
        toast.info(`📋 Đăng ký mới: ${data.full_name}`, { duration: 4000 })
      }
    },
    onUpdate: async (payload) => {
      const newRow = payload.new as any
      const oldRow = payload.old as any

      if (newRow.status === 'registered' && oldRow.status !== 'registered') {
        playSound()
        toast.success(`✅ ${newRow.full_name} đã thanh toán đăng ký!`, { duration: 5000 })
        pulseCardEffect('registrations')
      }

      // Update in list
      const supabase = createClient()
      const { data } = await supabase
        .from('registrations')
        .select('id, full_name, email, status, payment_status, created_at, tournament:tournaments(title)')
        .eq('id', newRow.id)
        .single()

      if (data) {
        setRecentRegistrations((prev) => {
          const idx = prev.findIndex((r) => r.id === data.id)
          if (idx >= 0) {
            const updated = [...prev]
            updated[idx] = data
            return updated
          }
          return prev
        })
        highlightRow(data.id)
      }
    },
  })

  // 🔴 REALTIME: Listen for new/updated donations
  useRealtimeTable({
    table: 'donations',
    onInsert: async (payload) => {
      const newRow = payload.new as any
      setStats((prev) => ({ ...prev, donations: prev.donations + 1 }))
      pulseCardEffect('donations')

      const supabase = createClient()
      const { data } = await supabase
        .from('donations')
        .select('id, donor_name, amount, status, created_at, tournament:tournaments(title)')
        .eq('id', newRow.id)
        .single()

      if (data) {
        setRecentDonations((prev) => [data, ...prev.slice(0, 4)])
        highlightRow(data.id)
      }
    },
    onUpdate: async (payload) => {
      const newRow = payload.new as any
      const oldRow = payload.old as any

      if (newRow.status === 'paid' && oldRow.status !== 'paid') {
        setStats((prev) => ({
          ...prev,
          totalDonationAmount: prev.totalDonationAmount + (newRow.amount || 0),
        }))
        pulseCardEffect('donations')
        playSound()
        toast.success(
          `💰 ${newRow.donor_name} đã ủng hộ ${(newRow.amount || 0).toLocaleString('vi-VN')} ₫!`,
          { duration: 5000 }
        )
      }

      // Update in list
      const supabase = createClient()
      const { data } = await supabase
        .from('donations')
        .select('id, donor_name, amount, status, created_at, tournament:tournaments(title)')
        .eq('id', newRow.id)
        .single()

      if (data) {
        setRecentDonations((prev) => {
          const idx = prev.findIndex((d) => d.id === data.id)
          if (idx >= 0) {
            const updated = [...prev]
            updated[idx] = data
            return updated
          }
          return prev
        })
        highlightRow(data.id)
      }
    },
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950/30 px-2.5 py-1 text-[11px] font-semibold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          DASHBOARD REALTIME
        </span>
        <span className="text-xs text-muted-foreground">Dữ liệu cập nhật tự động</span>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Giải đấu"
          value={stats.tournaments}
          icon={Trophy}
          href="/admin/giai-dau"
          color="bg-blue-500/10 text-blue-500"
          pulse={pulseCard === 'tournaments'}
        />
        <StatsCard
          label="Đơn đăng ký"
          value={stats.registrations}
          icon={ClipboardList}
          href="/admin/dang-ky"
          color="bg-green-500/10 text-green-500"
          pulse={pulseCard === 'registrations'}
        />
        <StatsCard
          label="Lượt ủng hộ"
          value={stats.donations}
          icon={Heart}
          href="/admin/ung-ho"
          color="bg-red-500/10 text-red-500"
          pulse={pulseCard === 'donations'}
        />
        <StatsCard
          label="Người dùng"
          value={stats.users}
          icon={Users}
          href="/admin/nguoi-dung"
          color="bg-purple-500/10 text-purple-500"
          pulse={pulseCard === 'users'}
        />
      </div>

      {/* Revenue */}
      <div className={`rounded-xl border border-border/60 bg-card p-6 transition-all duration-700 ${
        pulseCard === 'donations' ? 'ring-2 ring-primary/30' : ''
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tổng tiền ủng hộ</p>
            <p className={`text-2xl font-extrabold text-chart-3 transition-all duration-500 ${
              pulseCard === 'donations' ? 'scale-110' : ''
            }`}>
              {stats.totalDonationAmount.toLocaleString('vi-VN')} ₫
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registrations */}
        <div className="rounded-xl border border-border/60 bg-card">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              Đăng ký gần đây
            </h3>
            <Link href="/admin/dang-ky" className="text-xs font-medium text-primary hover:text-primary/80">
              Xem tất cả →
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {recentRegistrations.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">Chưa có đơn đăng ký.</p>
            ) : (
              recentRegistrations.map((reg: any) => (
                <Link
                  key={reg.id}
                  href={`/admin/dang-ky/${reg.id}`}
                  className={`flex items-center justify-between px-5 py-3 transition-all duration-700 ${
                    highlightIds.has(reg.id)
                      ? 'bg-green-50 dark:bg-green-950/20'
                      : 'hover:bg-secondary/40'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{reg.full_name}</p>
                      {highlightIds.has(reg.id) && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 text-[9px] font-bold text-green-700 dark:text-green-400 animate-pulse shrink-0">
                          <Sparkles className="h-2.5 w-2.5" />
                          MỚI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {reg.tournament?.title || 'N/A'}
                    </p>
                  </div>
                  <StatusBadge status={reg.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div className="rounded-xl border border-border/60 bg-card">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Heart className="h-4 w-4 text-destructive" />
              Ủng hộ gần đây
            </h3>
            <Link href="/admin/ung-ho" className="text-xs font-medium text-primary hover:text-primary/80">
              Xem tất cả →
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {recentDonations.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">Chưa có lượt ủng hộ.</p>
            ) : (
              recentDonations.map((don: any) => (
                <div
                  key={don.id}
                  className={`flex items-center justify-between px-5 py-3 transition-all duration-700 ${
                    highlightIds.has(don.id)
                      ? 'bg-green-50 dark:bg-green-950/20'
                      : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{don.donor_name}</p>
                      {highlightIds.has(don.id) && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 text-[9px] font-bold text-green-700 dark:text-green-400 animate-pulse shrink-0">
                          <Sparkles className="h-2.5 w-2.5" />
                          MỚI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {don.tournament?.title || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-bold text-primary">
                      {(don.amount || 0).toLocaleString('vi-VN')} ₫
                    </p>
                    <StatusBadge status={don.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
