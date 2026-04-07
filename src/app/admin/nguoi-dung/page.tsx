import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select(`
      *,
      user_roles(role:roles(code, name))
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Quản lý người dùng</h2>
        <p className="text-sm text-muted-foreground">{users?.length || 0} người dùng</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/30 text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Người dùng</th>
              <th className="px-4 py-3 hidden sm:table-cell">Vai trò</th>
              <th className="px-4 py-3 hidden md:table-cell">Thành phố</th>
              <th className="px-4 py-3 hidden md:table-cell">CLB</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {(!users || users.length === 0) ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Chưa có người dùng.</td></tr>
            ) : (
              users.map((u: any) => {
                const roles = (u.user_roles || []).map((ur: any) => ur.role?.name).filter(Boolean)
                return (
                  <tr key={u.id} className="border-b border-border/40 hover:bg-secondary/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{u.full_name || '—'}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {roles.map((r: string) => (
                          <span key={r} className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{r}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">{u.city || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">{u.club_name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${u.is_blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                        {u.is_blocked ? 'Bị khóa' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/nguoi-dung/${u.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
