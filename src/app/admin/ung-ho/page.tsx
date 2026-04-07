import { Suspense } from 'react'
import { AdminDonationsRealtime } from '@/components/admin/AdminDonationsRealtime'
import { Loader2 } from 'lucide-react'

export default function AdminDonationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminDonationsRealtime />
    </Suspense>
  )
}
