'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { updatePost } from '@/app/actions/admin/posts'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

export function PostEditForm({ post }: { post: any }) {
  const router = useRouter()
  const boundUpdate = updatePost.bind(null, post.id)
  const [state, formAction, pending] = useActionState(boundUpdate, null)

  useEffect(() => {
    if (state?.success) { toast.success('Lưu thành công!'); router.refresh() }
    if (state?.error) toast.error(state.error)
  }, [state, router])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/bai-viet"><Button variant="ghost" size="sm" className="gap-1"><ArrowLeft className="h-4 w-4" />Quay lại</Button></Link>
        <div>
          <h2 className="text-lg font-bold">Chỉnh sửa: {post.title}</h2>
          <p className="text-sm text-muted-foreground">Cập nhật tiêu đề, nội dung và ảnh để đồng bộ tin tức hiển thị trên trang chủ.</p>
        </div>
      </div>
      <Card className="border-border/60">
        <CardContent className="pt-6">
          <form action={formAction} className="space-y-5">
            <div className="space-y-2"><Label htmlFor="title">Tiêu đề hiển thị *</Label><Input id="title" name="title" defaultValue={post.title} required /></div>
            <div className="space-y-2"><Label htmlFor="slug">Slug *</Label><Input id="slug" name="slug" defaultValue={post.slug} required /></div>
            <div className="space-y-2"><Label htmlFor="excerpt">Mô tả ngắn</Label><Textarea id="excerpt" name="excerpt" rows={3} defaultValue={post.excerpt || ''} /></div>
            <RichTextEditor
              name="content"
              label="Nội dung bài viết"
              folder="posts"
              defaultValue={post.content || ''}
              placeholder="Soạn lại bài viết, chèn ảnh vào giữa nội dung và trình bày như một bài báo hoàn chỉnh."
            />
            <ImageUploadField
              name="cover_image"
              label="Ảnh bìa bài viết"
              defaultValue={post.cover_image || ''}
              folder="posts"
            />
            <div className="space-y-2">
              <Label htmlFor="story_image_urls">Danh sách link ảnh dọc (ưu tiên thay Canva)</Label>
              <Textarea
                id="story_image_urls"
                name="story_image_urls"
                rows={5}
                defaultValue={Array.isArray(post.story_image_urls) ? post.story_image_urls.join('\n') : ''}
                placeholder={"Mỗi dòng 1 link ảnh\nhttps://.../story-01.jpg\nhttps://.../story-02.jpg"}
              />
              <p className="text-xs text-muted-foreground">
                ✅ Nếu có ảnh ở đây, bài viết sẽ hiển thị dạng <strong>cuộn dọc</strong> như story/mobile feed. Có thể lấy ảnh bằng cách xuất từng trang từ Canva (PNG/JPG).
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
              Khu vực này dùng để admin chỉnh trực tiếp <strong>tiêu đề</strong>, <strong>nội dung</strong>, <strong>ảnh bìa</strong> và chèn <strong>ảnh vào giữa bài viết</strong>. Bài viết published có thể hiển thị ở popup trang chủ và mục tin tức.
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <select name="status" defaultValue={post.status} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="draft">Nháp</option>
                <option value="published">Xuất bản</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
            <input type="hidden" name="published_at" value={post.published_at || ''} />
            {state?.error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="submit" disabled={pending} className="gap-2">
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}<Save className="h-4 w-4" /> Lưu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
