'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createTournament } from '@/app/actions/admin/tournaments'
import { generateSlug } from '@/lib/validations/schemas'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { TextareaWithImageUpload } from '@/components/admin/TextareaWithImageUpload'

export default function NewTournamentPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(createTournament, null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [facebookPages, setFacebookPages] = useState<{ name: string; url: string }[]>([])

  useEffect(() => {
    if (state?.success && state.id) {
      toast.success('Tạo giải đấu thành công!')
      router.push(`/admin/giai-dau/${state.id}/edit`)
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, router])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugManual) {
      setSlug(generateSlug(val))
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/giai-dau">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h2 className="text-lg font-bold">Tạo giải đấu mới</h2>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Tên giải đấu *</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="VD: HEEA Marathon 2026"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
                  required
                  placeholder="heea-marathon-2026"
                />
              </div>
              <p className="text-xs text-muted-foreground">URL: /giai-dau/{slug || '...'}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Thể loại</Label>
                <Input id="category" name="category" placeholder="Chạy bộ, Xe đạp..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Thành phố</Label>
                <Input id="city" name="city" placeholder="TP. Hồ Chí Minh" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Quy định chung (Mô tả ngắn)</Label>
              <TextareaWithImageUpload
                id="short_description"
                name="short_description"
                placeholder="Nội dung quy định chung (hỗ trợ nhập văn bản và chèn ảnh)"
                folder="tournaments"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <TextareaWithImageUpload
                id="description"
                name="description"
                placeholder="Mô tả chi tiết (hỗ trợ nhập văn bản và chèn ảnh)"
                folder="tournaments"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Ngày bắt đầu</Label>
                <Input id="start_date" name="start_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Ngày kết thúc</Label>
                <Input id="end_date" name="end_date" type="date" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="registration_open_at">Mở đăng ký</Label>
                <Input id="registration_open_at" name="registration_open_at" type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration_close_at">Đóng đăng ký</Label>
                <Input id="registration_close_at" name="registration_close_at" type="datetime-local" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Địa điểm</Label>
              <Input id="location" name="location" placeholder="Địa điểm thi đấu" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ImageUploadField
                name="cover_image"
                label="Ảnh bìa"
                folder="tournaments"
              />
              <ImageUploadField
                name="home_cover_image"
                label="Ảnh bìa nhỏ (Trang chủ)"
                folder="tournaments"
              />
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 bg-secondary/10 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Danh sách Fanpage Facebook</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFacebookPages([...facebookPages, { name: '', url: '' }])}
                  className="gap-1 h-8"
                >
                  <Plus className="h-3.5 w-3.5" /> Thêm Fanpage
                </Button>
              </div>

              {facebookPages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">Chưa có fanpage nào. Bấm nút thêm để bắt đầu.</p>
              )}

              {facebookPages.map((page, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border/40">
                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Tên Fanpage {index + 1}</Label>
                      <Input
                        placeholder="VD: TOPPLAY"
                        value={page.name}
                        onChange={(e) => {
                          const newPages = [...facebookPages]
                          newPages[index].name = e.target.value
                          setFacebookPages(newPages)
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Link Fanpage {index + 1}</Label>
                      <Input
                        placeholder="https://facebook.com/..."
                        value={page.url}
                        onChange={(e) => {
                          const newPages = [...facebookPages]
                          newPages[index].url = e.target.value
                          setFacebookPages(newPages)
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive mt-6"
                    onClick={() => {
                      const newPages = [...facebookPages]
                      newPages.splice(index, 1)
                      setFacebookPages(newPages)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <input type="hidden" name="facebook_pages" value={JSON.stringify(facebookPages)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_participants">Số lượng tối đa</Label>
              <Input id="max_participants" name="max_participants" type="number" min="0" placeholder="Không giới hạn" />
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/10 p-4 space-y-4">
              <h3 className="font-bold text-sm">Cấu hình Tracking (Strava)</h3>
              <div className="space-y-2">
                <Label>Loại hoạt động hợp lệ</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="valid_activity_types" value="Run" defaultChecked />
                    Chạy bộ (Run)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="valid_activity_types" value="Walk" />
                    Đi bộ (Walk)
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min_pace">Pace tối thiểu (giây/km)</Label>
                  <Input id="min_pace" name="min_pace" type="number" min="0" defaultValue={240} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_pace">Pace tối đa (giây/km)</Label>
                  <Input id="max_pace" name="max_pace" type="number" min="0" defaultValue={900} />
                </div>
              </div>
            </div>

            <input type="hidden" name="status" value="draft" />
            <input type="hidden" name="is_featured" value="false" />

            {state?.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
              <Link href="/admin/giai-dau">
                <Button type="button" variant="ghost">Hủy</Button>
              </Link>
              <Button type="submit" disabled={pending} className="gap-2">
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Tạo giải đấu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
