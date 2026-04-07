import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil } from 'lucide-react'

export default async function AdminPostsPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, tournament:tournaments(title)')
    .order('created_at', { ascending: false })

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-red-100 text-red-600',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Quản lý bài viết</h2>
          <p className="text-sm text-muted-foreground">{posts?.length || 0} bài viết</p>
        </div>
        <Link href="/admin/bai-viet/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Tạo bài viết</Button>
        </Link>
      </div>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/30 text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3 hidden sm:table-cell">Giải đấu</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {(!posts || posts.length === 0) ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">Chưa có bài viết.</td></tr>
            ) : (
              posts.map((p: any) => (
                <tr key={p.id} className="border-b border-border/40 hover:bg-secondary/20">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground">
                    {(p.tournament as any)?.title || 'Độc lập'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[p.status] || ''}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/bai-viet/${p.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
