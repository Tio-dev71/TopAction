'use client'

import { Button } from '@/components/ui/button'
import { updateRegistrationStatus } from '@/app/actions/admin/registrations'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Ban } from 'lucide-react'

export function RegistrationActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter()

  const handleAction = async (status: string, label: string) => {
    if (!confirm(`Xác nhận ${label}?`)) return
    const note = prompt('Ghi chú (tùy chọn):') || undefined
    const result = await updateRegistrationStatus(id, status, note)
    if (result.error) toast.error(result.error)
    else { toast.success(`Đã ${label}`); router.refresh() }
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-card p-4">
      <span className="text-sm text-muted-foreground mr-auto py-1.5">Thao tác:</span>
      {(currentStatus === 'registered' || currentStatus === 'pending_payment') && (
        <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700" onClick={() => handleAction('confirmed', 'xác nhận đăng ký')}>
          <CheckCircle className="h-3.5 w-3.5" /> Xác nhận
        </Button>
      )}
      {currentStatus !== 'cancelled' && currentStatus !== 'rejected' && (
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleAction('cancelled', 'hủy đăng ký')}>
          <XCircle className="h-3.5 w-3.5" /> Hủy
        </Button>
      )}
      {currentStatus !== 'rejected' && currentStatus !== 'confirmed' && (
        <Button size="sm" variant="outline" className="gap-1.5 text-red-500" onClick={() => handleAction('rejected', 'từ chối đăng ký')}>
          <Ban className="h-3.5 w-3.5" /> Từ chối
        </Button>
      )}
    </div>
  )
}
