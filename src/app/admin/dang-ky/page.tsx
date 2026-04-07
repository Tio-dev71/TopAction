import { Suspense } from 'react'
import { AdminRegistrationsRealtime } from '@/components/admin/AdminRegistrationsRealtime'
import { Loader2 } from 'lucide-react'

export default function AdminRegistrationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminRegistrationsRealtime />
    </Suspense>
  )
}
