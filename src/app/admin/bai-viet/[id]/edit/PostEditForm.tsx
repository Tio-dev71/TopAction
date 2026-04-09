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
        <h2 className="text-lg font-bold">Chỉnh sửa: {post.title}</h2>
      </div>
      <Card className="border-border/60">
        <CardContent className="pt-6">
          <form action={formAction} className="space-y-5">
            <div className="space-y-2"><Label htmlFor="title">Tiêu đề *</Label><Input id="title" name="title" defaultValue={post.title} required /></div>
            <div className="space-y-2"><Label htmlFor="slug">Slug *</Label><Input id="slug" name="slug" defaultValue={post.slug} required /></div>
            <div className="space-y-2"><Label htmlFor="excerpt">Tóm tắt</Label><Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post.excerpt || ''} /></div>
            <div className="space-y-2"><Label htmlFor="content">Nội dung</Label><Textarea id="content" name="content" rows={12} defaultValue={post.content || ''} /></div>
            <ImageUploadField
              name="cover_image"
              label="Ảnh bìa"
              defaultValue={post.cover_image || ''}
              folder="posts"
            />
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
