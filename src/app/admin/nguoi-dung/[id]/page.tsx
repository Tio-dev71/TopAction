import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { UserRoleManager } from './RoleManager'

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, user_roles(id, role:roles(id, code, name))')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: allRoles } = await supabase.from('roles').select('*').order('code')

  // Get user registration count
  const { count: regCount } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', id)

  // Get user donation count
  const { count: donCount } = await supabase
    .from('donations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', id)

  const currentRoleCodes = (profile.user_roles || []).map((ur: any) => ur.role?.code).filter(Boolean)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/nguoi-dung">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h2 className="text-lg font-bold">{profile.full_name || 'Người dùng'}</h2>
          <p className="text-xs text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      {/* Profile info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard label="Họ tên" value={profile.full_name || '—'} />
        <InfoCard label="Email" value={profile.email || '—'} />
        <InfoCard label="SĐT" value={profile.phone || '—'} />
        <InfoCard label="Giới tính" value={profile.gender || '—'} />
        <InfoCard label="Thành phố" value={profile.city || '—'} />
        <InfoCard label="CLB" value={profile.club_name || '—'} />
        <InfoCard label="Đơn ĐK" value={`${regCount || 0}`} />
        <InfoCard label="Lượt ủng hộ" value={`${donCount || 0}`} />
      </div>

      {/* Role Manager */}
      <UserRoleManager
        userId={id}
        allRoles={allRoles || []}
        currentRoles={currentRoleCodes}
      />
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  )
}
