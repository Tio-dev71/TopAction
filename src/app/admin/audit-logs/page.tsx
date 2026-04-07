import { createClient } from '@/lib/supabase/server'

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; table?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('audit_logs')
    .select('*, actor:profiles!audit_logs_actor_user_id_fkey(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (params.action) {
    query = query.ilike('action', `%${params.action}%`)
  }

  if (params.table) {
    query = query.eq('target_table', params.table)
  }

  const { data: logs } = await query

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Audit Log</h2>
        <p className="text-sm text-muted-foreground">Lịch sử thao tác hệ thống</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/30 text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3">Người thực hiện</th>
              <th className="px-4 py-3">Hành động</th>
              <th className="px-4 py-3 hidden md:table-cell">Bảng</th>
              <th className="px-4 py-3 hidden lg:table-cell">IP</th>
            </tr>
          </thead>
          <tbody>
            {(!logs || logs.length === 0) ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Chưa có log.</td></tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log.id} className="border-b border-border/40 hover:bg-secondary/20">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{(log.actor as any)?.full_name || '—'}</p>
                    <p className="text-xs text-muted-foreground">{log.actor_role}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                    {log.target_table ? `${log.target_table}/${log.target_id?.substring(0, 8)}` : '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">{log.ip_address || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
