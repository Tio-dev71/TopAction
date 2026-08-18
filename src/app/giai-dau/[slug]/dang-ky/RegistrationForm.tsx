'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createRegistration } from '@/app/actions/registration'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, CheckCircle, AlertTriangle, Trophy, Check } from 'lucide-react'

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
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

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
    <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <Link href={`/giai-dau/${tournament.slug}`} className="text-[13px] font-semibold text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại giải đấu
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Trophy className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Đăng ký tham gia</h1>
            <p className="text-[14px] font-medium text-muted-foreground mt-0.5 line-clamp-1">{tournament.title}</p>
          </div>
        </div>
      </div>

      {/* Registration closed */}
      {registrationClosed && (
        <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
          <p className="text-[14px] font-semibold text-yellow-800">{closedReason}</p>
        </div>
      )}

      {/* Existing registrations */}
      {existingRegistrations.length > 0 && (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <p className="text-[14px] font-bold text-primary mb-3">Bạn đã đăng ký các hạng mục sau:</p>
          <div className="space-y-2">
            {existingRegistrations.map((r: any) => (
              <div key={r.id} className="flex items-center gap-2 text-[14px] font-medium text-foreground">
                <CheckCircle className="h-4 w-4 text-[#22b39b]" />
                <span>Mã: <strong className="text-primary">{r.registration_code}</strong> — Trạng thái: <strong>{r.status}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration form */}
      {!registrationClosed && (
        <form action={formAction} className="pb-32">
          <input type="hidden" name="tournament_id" value={tournament.id} />
          
          <div className="space-y-6">
            
            {/* Section 1: Thông tin cá nhân */}
            <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8">
              <h2 className="text-lg font-extrabold text-foreground mb-6">Thông tin cá nhân</h2>
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-[13px] font-semibold">Họ tên *</Label>
                  <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} required className="h-12 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px] font-semibold">Email *</Label>
                  <Input id="email" name="email" type="email" defaultValue={profile?.email || ''} required className="h-12 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[13px] font-semibold">Số điện thoại *</Label>
                  <Input id="phone" name="phone" defaultValue={profile?.phone || ''} required className="h-12 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-[13px] font-semibold">Giới tính</Label>
                  <select name="gender" defaultValue={profile?.gender || ''} className="w-full h-12 rounded-xl border border-transparent bg-secondary/30 px-3 py-2 text-[14px] font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                    <option value="">Chọn...</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_date" className="text-[13px] font-semibold">Ngày sinh</Label>
                  <Input id="birth_date" name="birth_date" type="date" defaultValue={profile?.birth_date || ''} className="h-12 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[13px] font-semibold">Thành phố</Label>
                  <Input id="city" name="city" defaultValue={profile?.city || ''} className="h-12 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="club_name" className="text-[13px] font-semibold">CLB / Nhóm</Label>
                  <Input id="club_name" name="club_name" defaultValue={profile?.club_name || ''} className="h-12 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact" className="text-[13px] font-semibold">Liên hệ khẩn cấp</Label>
                  <Input id="emergency_contact" name="emergency_contact" defaultValue={profile?.emergency_contact || ''} placeholder="Tên - SĐT" className="h-12 rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="note" className="text-[13px] font-semibold">Ghi chú bổ sung</Label>
                  <Textarea id="note" name="note" rows={3} placeholder="Ví dụ: Kích thước áo, dị ứng..." className="rounded-xl bg-secondary/30 border-transparent focus-visible:border-primary resize-none" />
                </div>
              </div>
            </div>

            {/* Section 2: Chọn cự ly */}
            <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8">
              <h2 className="text-lg font-extrabold text-foreground mb-6">Chọn cự ly *</h2>
              
              {activeCategories.length === 0 ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-600">
                  Ban tổ chức chưa mở hạng mục thi đấu nào. Vui lòng quay lại sau!
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCategories.map((cat: any) => {
                    const isRegistered = registeredCategoryIds.includes(cat.id)
                    const isFull = cat.capacity && cat.registered_count >= cat.capacity
                    const disabled = isRegistered || isFull
                    const isSelected = selectedCategory?.id === cat.id

                    return (
                      <label
                        key={cat.id}
                        className={`group relative flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                          disabled
                            ? 'border-border/40 bg-secondary/10 opacity-60 cursor-not-allowed'
                            : isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-transparent bg-secondary/20 hover:bg-secondary/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category_id"
                          value={cat.id}
                          disabled={disabled}
                          required
                          className="sr-only"
                          onChange={() => setSelectedCategory(cat)}
                        />
                        
                        {isSelected && (
                          <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-bl-xl">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}

                        <div>
                          <p className="font-extrabold text-[16px] text-foreground flex items-center gap-2">
                            {cat.name}
                            {isRegistered && <span className="text-[11px] font-bold bg-[#22b39b]/10 text-[#22b39b] px-2 py-0.5 rounded-full uppercase">Đã tham gia</span>}
                            {isFull && !isRegistered && <span className="text-[11px] font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full uppercase">Hết vé</span>}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[13px] text-muted-foreground font-medium">
                            {cat.distance && <span>Cự ly: {cat.distance}</span>}
                            <span>•</span>
                            <span>{cat.registered_count}/{cat.capacity || '∞'} slot</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className={`text-lg font-extrabold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {cat.price > 0 ? `${cat.price.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
            
            {state?.error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-semibold text-destructive">
                {state.error}
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-10px_40px_rgb(0,0,0,0.05)] p-4 sm:p-5">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">Tổng tiền</p>
                <p className="text-2xl font-extrabold text-foreground">
                  {selectedCategory 
                    ? (selectedCategory.price > 0 ? `${selectedCategory.price.toLocaleString('vi-VN')} ₫` : 'Miễn phí') 
                    : '0 ₫'}
                </p>
              </div>
              <Button type="submit" disabled={pending || !selectedCategory} className="h-14 px-8 rounded-xl text-[16px] font-bold bg-[#1d4ed8] shadow-md shadow-primary/20 shrink-0">
                {pending && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                {pending ? 'Đang xử lý...' : 'Thanh toán ngay'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
