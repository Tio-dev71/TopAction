import { createClient } from '@/lib/supabase/server'
import { MediaGrid } from './MediaGrid'

export default async function AdminMediaPage() {
  const supabase = await createClient()

  const { data: assets } = await supabase
    .from('media_assets')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Quản lý Media</h2>
        <p className="text-sm text-muted-foreground">{assets?.length || 0} file</p>
      </div>

      <div className="rounded-xl border border-dashed border-border/60 bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Upload ảnh qua trang chỉnh sửa giải đấu / bài viết.
        </p>
        <p className="text-xs text-muted-foreground">
          Media manager đầy đủ sẽ hỗ trợ drag-and-drop upload trong phiên bản tiếp theo.
        </p>
      </div>

      {assets && assets.length > 0 && (
        <MediaGrid assets={assets} />
      )}
    </div>
  )
}
