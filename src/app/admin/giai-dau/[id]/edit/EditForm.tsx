'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  updateTournament,
  saveTournamentCategory,
  deleteTournamentCategory,
  saveTournamentRule,
  saveOrganizer,
  deleteOrganizer,
} from '@/app/actions/admin/tournaments'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Plus, Trash2, Save, Edit2, X } from 'lucide-react'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { TextareaWithImageUpload } from '@/components/admin/TextareaWithImageUpload'

function formatDatetimeLocal(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  // Move UTC to Vietnam time (+7) for display purposes
  const vnTime = new Date(d.getTime() + 7 * 3600 * 1000);
  return vnTime.toISOString().slice(0, 16);
}

export function TournamentEditForm({ tournament }: { tournament: any }) {
  const router = useRouter()
  const boundUpdate = updateTournament.bind(null, tournament.id)
  const [state, formAction, pending] = useActionState(boundUpdate, null)

  const [facebookPages, setFacebookPages] = useState<{ name: string; url: string }[]>(
    tournament.facebook_pages || (
      tournament.facebook_page_url 
      ? [{ name: tournament.facebook_page_name || 'TOPPLAY', url: tournament.facebook_page_url }] 
      : []
    )
  )

  useEffect(() => {
    if (state?.success) {
      toast.success('Cập nhật thành công!')
      router.refresh()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/admin/giai-dau/${tournament.id}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h2 className="text-lg font-bold">Chỉnh sửa: {tournament.title}</h2>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Thông tin</TabsTrigger>
          <TabsTrigger value="categories">Hạng mục ({tournament.categories?.length || 0})</TabsTrigger>
          <TabsTrigger value="rules">Quy định ({tournament.rules?.length || 0})</TabsTrigger>
          <TabsTrigger value="organizers">Tổ chức ({tournament.organizers?.length || 0})</TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general">
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <form action={formAction} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên giải đấu (ID/Chính thức) *</Label>
                  <Input id="title" name="title" defaultValue={tournament.title} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_title">Tên hiển thị (Trang chủ)</Label>
                  <Input id="display_title" name="display_title" defaultValue={tournament.display_title || ''} placeholder="VD: Sải bước nghĩa tình" />
                  <p className="text-xs text-muted-foreground">Để trống nếu muốn dùng tên chính thức.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" name="slug" defaultValue={tournament.slug} required />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Thể loại</Label>
                    <Input id="category" name="category" defaultValue={tournament.category || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Thành phố</Label>
                    <Input id="city" name="city" defaultValue={tournament.city || ''} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Quy định chung (Mô tả ngắn)</Label>
                  <TextareaWithImageUpload
                    id="short_description"
                    name="short_description"
                    defaultValue={tournament.short_description || ''}
                    folder="tournaments"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả chi tiết</Label>
                  <TextareaWithImageUpload
                    id="description"
                    name="description"
                    defaultValue={tournament.description || ''}
                    folder="tournaments"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Ngày bắt đầu</Label>
                    <Input id="start_date" name="start_date" type="date" defaultValue={tournament.start_date || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">Ngày kết thúc</Label>
                    <Input id="end_date" name="end_date" type="date" defaultValue={tournament.end_date || ''} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="registration_open_at">Mở đăng ký</Label>
                    <Input id="registration_open_at" name="registration_open_at" type="datetime-local" defaultValue={formatDatetimeLocal(tournament.registration_open_at)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration_close_at">Đóng đăng ký</Label>
                    <Input id="registration_close_at" name="registration_close_at" type="datetime-local" defaultValue={formatDatetimeLocal(tournament.registration_close_at)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input id="location" name="location" defaultValue={tournament.location || ''} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ImageUploadField
                    name="cover_image"
                    label="Ảnh bìa"
                    defaultValue={tournament.cover_image || ''}
                    folder="tournaments"
                  />
                  <ImageUploadField
                    name="home_cover_image"
                    label="Ảnh bìa nhỏ (Trang chủ)"
                    defaultValue={tournament.home_cover_image || ''}
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="max_participants">Số lượng tối đa</Label>
                    <Input id="max_participants" name="max_participants" type="number" min="0" defaultValue={tournament.max_participants || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nổi bật</Label>
                    <div className="flex items-center gap-2 pt-2">
                      <input type="hidden" name="is_featured" value={tournament.is_featured ? 'true' : 'false'} />
                      <label className="text-sm text-muted-foreground">
                        {tournament.is_featured ? '✅ Đang nổi bật' : 'Không nổi bật'}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-secondary/10 p-4 space-y-4">
                  <h3 className="font-bold text-sm">Cấu hình Tracking (Strava/Garmin)</h3>
                  <div className="space-y-2">
                    <Label>Loại hoạt động hợp lệ</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="valid_activity_types" value="Run" defaultChecked={tournament.valid_activity_types?.includes('Run')} />
                        Chạy bộ (Run)
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="valid_activity_types" value="Walk" defaultChecked={tournament.valid_activity_types?.includes('Walk')} />
                        Đi bộ (Walk)
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="min_pace">Pace tối thiểu (giây/km) - Nhanh nhất</Label>
                      <Input id="min_pace" name="min_pace" type="number" min="0" defaultValue={tournament.min_pace ?? 240} placeholder="Ví dụ: 240 (4:00/km)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_pace">Pace tối đa (giây/km) - Chậm nhất</Label>
                      <Input id="max_pace" name="max_pace" type="number" min="0" defaultValue={tournament.max_pace ?? 900} placeholder="Ví dụ: 900 (15:00/km)" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gợi ý: 240 tương đương Pace 4:00. 900 tương đương Pace 15:00. Những hoạt động nằm ngoài khoảng pace này sẽ hiển thị là không hợp lệ (is_valid = false).
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-secondary/10 p-4 space-y-4">
                  <h3 className="font-bold text-sm">Cấu hình Thiện nguyện / Quỹ</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="donation_goal">Mục tiêu quyên góp (VND)</Label>
                      <Input id="donation_goal" name="donation_goal" type="number" min="0" defaultValue={tournament.donation_goal ?? ''} placeholder="Ví dụ: 500000000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donation_description">Nội dung giải thích (text nhỏ bên dưới thanh tiến trình)</Label>
                    <Textarea id="donation_description" name="donation_description" rows={2} defaultValue={tournament.donation_description || ''} placeholder="Mỗi lượt đăng ký là 100.000 VND gửi đến Quỹ..." />
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="charity_iframe_url">Link Iframe Thiện Nguyện (tuỳ chọn)</Label>
                    <Input id="charity_iframe_url" name="charity_iframe_url" type="url" defaultValue={tournament.charity_iframe_url || ''} placeholder="VD: https://thiennguyen.app/doi-tac/minh-bach-tai-khoan/1961" />
                    <p className="text-xs text-muted-foreground">Ví dụ: https://thiennguyen.app/doi-tac/minh-bach-tai-khoan/1961 - Hệ thống sẽ nhúng thống kê trực tiếp.</p>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                  <h3 className="font-bold text-sm text-primary">Cấu hình Giải thưởng</h3>
                  <div className="space-y-2">
                    <Label htmlFor="rewards_title">Tên hiển thị (Tiêu đề phần giải thưởng)</Label>
                    <Input 
                      id="rewards_title" 
                      name="rewards_title" 
                      defaultValue={tournament.rewards_title || 'Giải thưởng'} 
                      placeholder="VD: Cơ cấu giải thưởng, Giải thưởng hấp dẫn..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Đây là tên sẽ hiển thị ở tiêu đề phần Giải thưởng và trên thẻ giải đấu ở trang chủ (Badge).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rewards_description">Nội dung giải thưởng chi tiết</Label>
                    <TextareaWithImageUpload
                      id="rewards_description"
                      name="rewards_description"
                      defaultValue={tournament.rewards_description || ''}
                      folder="tournaments"
                      placeholder="Mô tả chi tiết các giải thưởng cho từng hạng mục..."
                    />
                  </div>
                </div>

                <input type="hidden" name="status" value={tournament.status} />

                {state?.error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="submit" disabled={pending} className="gap-2">
                    {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Save className="h-4 w-4" />
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategoriesEditor tournamentId={tournament.id} categories={tournament.categories || []} />
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules">
          <RulesEditor tournamentId={tournament.id} rules={tournament.rules || []} />
        </TabsContent>

        {/* Organizers Tab */}
        <TabsContent value="organizers">
          <OrganizersEditor tournamentId={tournament.id} organizers={tournament.organizers || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ---- Categories Editor ----
function CategoriesEditor({ tournamentId, categories }: { tournamentId: string; categories: any[] }) {
  const router = useRouter()
  const boundSave = saveTournamentCategory.bind(null, tournamentId)
  const [state, formAction, pending] = useActionState(boundSave, null)

  useEffect(() => {
    if (state?.success) { toast.success('Lưu hạng mục thành công!'); router.refresh() }
    if (state?.error) toast.error(state.error)
  }, [state, router])

  const handleDelete = async (catId: string) => {
    if (!confirm('Xóa hạng mục này?')) return
    const res = await deleteTournamentCategory(catId, tournamentId)
    if (res.error) toast.error(res.error)
    else { toast.success('Đã xóa'); router.refresh() }
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Hạng mục thi đấu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{cat.name} {cat.distance && `(${cat.distance})`}</p>
              <p className="text-xs text-muted-foreground">
                {cat.price > 0 ? `${cat.price.toLocaleString('vi-VN')} ₫` : 'Miễn phí'} · {cat.registered_count}/{cat.capacity || '∞'} đã ĐK
              </p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDelete(cat.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <form action={formAction} className="space-y-3 rounded-lg border border-dashed border-border/60 p-4">
          <p className="text-sm font-medium">Thêm hạng mục mới</p>
          <div className="grid grid-cols-2 gap-3">
            <Input name="name" placeholder="Tên (VD: 10km)" required />
            <Input name="distance" placeholder="Cự ly (VD: 10 km)" />
            <Input name="price" type="number" min="0" defaultValue="0" placeholder="Giá (VNĐ)" />
            <Input name="capacity" type="number" min="0" placeholder="Sức chứa" />
          </div>
          <input type="hidden" name="sort_order" value={categories.length} />
          <input type="hidden" name="is_active" value="true" />
          <Button type="submit" size="sm" disabled={pending} className="gap-1.5">
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <Plus className="h-3.5 w-3.5" /> Thêm
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// ---- Rules Editor ----
function RulesEditor({ tournamentId, rules }: { tournamentId: string; rules: any[] }) {
  const router = useRouter()
  const boundSave = saveTournamentRule.bind(null, tournamentId)
  const [state, formAction, pending] = useActionState(boundSave, null)

  useEffect(() => {
    if (state?.success) { toast.success('Lưu quy định thành công!'); router.refresh() }
    if (state?.error) toast.error(state.error)
  }, [state, router])

  return (
    <Card className="border-border/60">
      <CardHeader><CardTitle className="text-base">Quy định sự kiện</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="rounded-lg border border-border/40 p-3">
            <p className="text-sm font-medium">{rule.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{rule.content}</p>
          </div>
        ))}
        <form action={formAction} className="space-y-3 rounded-lg border border-dashed border-border/60 p-4">
          <p className="text-sm font-medium">Thêm quy định mới</p>
          <Input name="title" placeholder="Tiêu đề" required />
          <Textarea name="content" placeholder="Nội dung" rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Input name="icon" placeholder="Icon (running, gauge...)" />
            <Input name="rule_type" placeholder="Loại (sport, pace...)" />
          </div>
          <input type="hidden" name="sort_order" value={rules.length} />
          <Button type="submit" size="sm" disabled={pending} className="gap-1.5">
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <Plus className="h-3.5 w-3.5" /> Thêm
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// ---- Organizers Editor ----
function OrganizersEditor({ tournamentId, organizers }: { tournamentId: string; organizers: any[] }) {
  const router = useRouter()
  const boundSave = saveOrganizer.bind(null, tournamentId)
  const [state, formAction, pending] = useActionState(boundSave, null)
  const [editingOrg, setEditingOrg] = useState<any>(null)

  useEffect(() => {
    if (state?.success) { 
      toast.success('Lưu thành công!')
      setEditingOrg(null)
      router.refresh() 
    }
    if (state?.error) toast.error(state.error)
  }, [state, router])

  const handleDelete = async (orgId: string) => {
    if (!confirm('Xóa đơn vị này?')) return
    const res = await deleteOrganizer(orgId, tournamentId)
    if (res.error) toast.error(res.error)
    else { toast.success('Đã xóa'); router.refresh() }
  }

  return (
    <Card className="border-border/60">
      <CardHeader><CardTitle className="text-base">Đơn vị tổ chức & Đồng hành</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {organizers.map((org) => (
          <div key={org.id} className="flex items-center gap-3 rounded-lg border border-border/40 p-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{org.name} <span className="text-xs text-muted-foreground">({org.type})</span></p>
              <p className="text-xs text-muted-foreground mt-1">{org.description}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingOrg(org)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDelete(org.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <form key={editingOrg ? editingOrg.id : 'new'} action={formAction} className="space-y-3 rounded-lg border border-dashed border-border/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{editingOrg ? 'Sửa đơn vị' : 'Thêm đơn vị mới'}</p>
            {editingOrg && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingOrg(null)} className="h-7 px-2 text-muted-foreground">
                <X className="h-4 w-4 mr-1" /> Hủy
              </Button>
            )}
          </div>
          {editingOrg && <input type="hidden" name="id" value={editingOrg.id} />}
          <Input name="name" placeholder="Tên đơn vị" defaultValue={editingOrg?.name || ''} required />
          <Textarea name="description" placeholder="Mô tả" rows={2} defaultValue={editingOrg?.description || ''} />
          <div className="grid grid-cols-2 gap-3">
            <select name="type" defaultValue={editingOrg?.type || 'organizer'} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="organizer">Tổ chức</option>
              <option value="sponsor">Tài trợ</option>
              <option value="partner">Đồng hành</option>
            </select>
            <ImageUploadField
              name="logo_url"
              label="Logo"
              folder="organizers"
              defaultValue={editingOrg?.logo_url || ''}
              showPreview={true}
            />
          </div>
          <input type="hidden" name="sort_order" value={editingOrg ? editingOrg.sort_order : organizers.length} />
          <Button type="submit" size="sm" disabled={pending} className="gap-1.5">
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {editingOrg ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />} 
            {editingOrg ? 'Lưu thay đổi' : 'Thêm'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
