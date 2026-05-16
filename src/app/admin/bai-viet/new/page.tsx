'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createPost } from '@/app/actions/admin/posts'
import { generateSlug } from '@/lib/validations/schemas'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import { ImageUploadField } from '@/components/admin/ImageUploadField'

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
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung bài viết</Label>
              <Textarea id="content" name="content" rows={12} placeholder="Nhập nội dung chi tiết bài viết để hiển thị trên popup và trang tin tức" />
            </div>
            <ImageUploadField
              name="cover_image"
              label="Ảnh bài viết"
              folder="posts"
            />
            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
              Admin có thể chỉnh trực tiếp <strong>tiêu đề</strong>, <strong>nội dung</strong> và <strong>ảnh</strong> tại đây. Khi chuyển sang <strong>Xuất bản</strong>, bài viết sẽ sẵn sàng lấy lên trang chủ.
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
