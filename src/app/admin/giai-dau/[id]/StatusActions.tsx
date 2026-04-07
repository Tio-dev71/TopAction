'use client'

import { Button } from '@/components/ui/button'
import { updateTournamentStatus } from '@/app/actions/admin/tournaments'
import { toast } from 'sonner'
import { Globe, Archive, XCircle, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function TournamentStatusActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter()

  const handleStatusChange = async (status: string) => {
    const labels: Record<string, string> = {
      published: 'xuất bản',
      closed: 'đóng',
      archived: 'lưu trữ',
      draft: 'chuyển về nháp',
    }
    
    if (!confirm(`Bạn có chắc muốn ${labels[status] || status} giải đấu này?`)) return

    const result = await updateTournamentStatus(id, status)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Đã ${labels[status]} giải đấu`)
      router.refresh()
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {currentStatus === 'draft' && (
        <Button variant="outline" size="sm" className="gap-1.5 text-green-600" onClick={() => handleStatusChange('published')}>
          <Globe className="h-3.5 w-3.5" />
          Xuất bản
        </Button>
      )}
      {currentStatus === 'published' && (
        <>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleStatusChange('closed')}>
            <XCircle className="h-3.5 w-3.5" />
            Đóng
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleStatusChange('draft')}>
            Về nháp
          </Button>
        </>
      )}
      {(currentStatus === 'closed' || currentStatus === 'draft') && (
        <Button variant="outline" size="sm" className="gap-1.5 text-red-500" onClick={() => handleStatusChange('archived')}>
          <Archive className="h-3.5 w-3.5" />
          Lưu trữ
        </Button>
      )}
      {currentStatus === 'archived' && (
        <Button variant="outline" size="sm" onClick={() => handleStatusChange('draft')}>
          Khôi phục
        </Button>
      )}
    </div>
  )
}
