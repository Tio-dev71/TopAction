'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { createPost } from '@/app/actions/admin/posts'
import { generateSlug } from '@/lib/validations/schemas'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

export default function NewPostPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(createPost, null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')

  useEffect(() => {
    if (state?.success) { toast.success('Tạo bài viết thành công!'); router.push('/admin/bai-viet') }
    if (state?.error) toast.error(state.error)
  }, [state, router])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/bai-viet"><Button variant="ghost" size="sm" className="gap-1"><ArrowLeft className="h-4 w-4" />Quay lại</Button></Link>
        <div>
          <h2 className="text-lg font-bold">Tạo bài viết mới</h2>
          <p className="text-sm text-muted-foreground">Bài viết published sẽ có thể hiển thị tại popup và khu vực tin tức trên trang chủ.</p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardContent className="pt-6">
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề hiển thị *</Label>
              <Input id="title" name="title" value={title} onChange={(e) => { setTitle(e.target.value); setSlug(generateSlug(e.target.value)) }} placeholder="Ví dụ: 65 năm - Chung tay xoa dịu nỗi đau da cam" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Mô tả ngắn</Label>
              <Textarea id="excerpt" name="excerpt" rows={3} placeholder="Đoạn mô tả ngắn dùng cho card tin tức và popup trang chủ" />
            </div>
            <RichTextEditor
              name="content"
              label="Nội dung bài viết"
              folder="posts"
              placeholder="Soạn bài viết dạng thông cáo, bài báo, chiến dịch... Bạn có thể chèn ảnh vào giữa nội dung ở bất kỳ vị trí nào."
            />
            <ImageUploadField
              name="cover_image"
              label="Ảnh bìa bài viết"
              folder="posts"
            />
            {/* Canva Embed */}
            <div className="space-y-2">
              <Label htmlFor="canva_embed_url">Link Canva (tùy chọn)</Label>
              <Input
                id="canva_embed_url"
                name="canva_embed_url"
                type="url"
                placeholder="https://www.canva.com/design/.../view?embed"
              />
              <p className="text-xs text-muted-foreground">
                ⚡ Nếu có link này, bài viết sẽ hiển thị dạng <strong>Landing Page toàn màn hình</strong> từ Canva. <br/>
                <strong className="text-destructive">Quan trọng:</strong> Bạn phải lấy link Embed (Chia sẻ -&gt; Xem thêm -&gt; Nhúng) và đảm bảo thiết kế được để ở chế độ <strong>Công khai (Bất kỳ ai có liên kết)</strong>, nếu không Canva sẽ từ chối kết nối. Hệ thống sẽ tự động chuyển link `/view` thành `/view?embed`.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="story_image_urls">Danh sách link ảnh dọc (ưu tiên thay Canva)</Label>
              <Textarea
                id="story_image_urls"
                name="story_image_urls"
                rows={5}
                placeholder={"Mỗi dòng 1 link ảnh\nhttps://.../story-01.jpg\nhttps://.../story-02.jpg"}
              />
              <p className="text-xs text-muted-foreground">
                ✅ Nếu có ảnh ở đây, bài viết sẽ hiển thị dạng <strong>cuộn dọc</strong> như story/mobile feed. Có thể lấy ảnh bằng cách xuất từng trang từ Canva (PNG/JPG).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <select name="status" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="draft">Nháp</option>
                <option value="published">Xuất bản</option>
              </select>
            </div>
            {state?.error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button type="submit" disabled={pending} className="gap-2">
                {pending && <Loader2 className="h-4 w-4 animate-spin" />} Tạo bài viết
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
