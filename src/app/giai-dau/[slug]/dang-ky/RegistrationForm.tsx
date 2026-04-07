'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createRegistration } from '@/app/actions/registration'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, CheckCircle, AlertTriangle, Trophy } from 'lucide-react'

export function RegistrationForm({
  tournament,
  profile,
  registrationClosed,
  closedReason,
  existingRegistrations,
}: {
  tournament: any
  profile: any
  registrationClosed: boolean
  closedReason: string
  existingRegistrations: any[]
}) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(createRegistration, null)

  useEffect(() => {
    if (state?.success) {
      if (state.paymentRequired && state.paymentUrl) {
        toast.info('Đang chuyển đến trang thanh toán...')
        window.location.href = state.paymentUrl
      } else if (state.paymentRequired && state.paymentError) {
        toast.error('Đă đăng ký nhưng chưa thanh toán: ' + state.paymentError)
      } else {
        toast.success(`Đăng ký thành công! Mã: ${state.registrationCode}`)
        router.push('/ca-nhan')
      }
    }
    if (state?.error) toast.error(state.error)
  }, [state, router])

  const registeredCategoryIds = existingRegistrations.map((r: any) => r.category_id)
  const activeCategories = (tournament.categories || []).filter((c: any) => c.is_active)

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link href={`/giai-dau/${tournament.slug}`} className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại giải đấu
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Đăng ký tham gia</h1>
            <p className="text-sm text-muted-foreground">{tournament.title}</p>
          </div>
        </div>
      </div>

      {/* Registration closed */}
      {registrationClosed && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 p-5">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-800">{closedReason}</p>
          </CardContent>
        </Card>
      )}

      {/* Existing registrations */}
      {existingRegistrations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 mb-6">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-blue-800 mb-2">Bạn đã đăng ký:</p>
            {existingRegistrations.map((r: any) => (
              <div key={r.id} className="flex items-center gap-2 text-sm text-blue-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Mã: {r.registration_code} — {r.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Registration form */}
      {!registrationClosed && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Thông tin đăng ký</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-5">
              <input type="hidden" name="tournament_id" value={tournament.id} />

              {/* Category selection */}
              <div className="space-y-2">
                <Label>Hạng mục thi đấu *</Label>
                <div className="grid gap-2">
                  {activeCategories.map((cat: any) => {
                    const isRegistered = registeredCategoryIds.includes(cat.id)
                    const isFull = cat.capacity && cat.registered_count >= cat.capacity
                    const disabled = isRegistered || isFull

                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all ${
                          disabled
                            ? 'border-border/40 opacity-50 cursor-not-allowed'
                            : 'border-border/60 hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="category_id"
                            value={cat.id}
                            disabled={disabled}
                            required
                            className="accent-primary"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {cat.name}
                              {cat.distance && <span className="text-muted-foreground ml-1">({cat.distance})</span>}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {cat.registered_count}/{cat.capacity || '∞'} đã ĐK
                              {isRegistered && ' · ✅ Đã đăng ký'}
                              {isFull && !isRegistered && ' · Hết chỗ'}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {cat.price > 0 ? `${cat.price.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Personal info - prefilled from profile */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Họ tên *</Label>
                  <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" defaultValue={profile?.email || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input id="phone" name="phone" defaultValue={profile?.phone || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <select name="gender" defaultValue={profile?.gender || ''} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Chọn...</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Ngày sinh</Label>
                  <Input id="birth_date" name="birth_date" type="date" defaultValue={profile?.birth_date || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Thành phố</Label>
                  <Input id="city" name="city" defaultValue={profile?.city || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="club_name">CLB / Nhóm</Label>
                  <Input id="club_name" name="club_name" defaultValue={profile?.club_name || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team_name">Tên đội</Label>
                  <Input id="team_name" name="team_name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact">Liên hệ khẩn cấp</Label>
                <Input id="emergency_contact" name="emergency_contact" defaultValue={profile?.emergency_contact || ''} placeholder="Tên - SĐT" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea id="note" name="note" rows={2} placeholder="Thông tin bổ sung (nếu có)" />
              </div>

              {state?.error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
              )}

              <div className="border-t border-border/60 pt-5">
                <p className="text-xs text-muted-foreground mb-3">
                  Bằng việc đăng ký, bạn đồng ý với quy chế giải đấu và chịu trách nhiệm về sức khỏe cá nhân.
                </p>
                <Button type="submit" disabled={pending} size="lg" className="w-full gap-2 text-base">
                  {pending && <Loader2 className="h-5 w-5 animate-spin" />}
                  {pending ? 'Đang xử lý...' : 'Đăng ký ngay'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}
