import { requireStaff, getAuthUserWithRoles } from '@/lib/auth/permissions'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản trị | TOPPLAY',
  robots: 'noindex, nofollow',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireStaff('/admin')
  const authData = await getAuthUserWithRoles()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar
        user={authData?.profile}
        roles={authData?.roles || []}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader user={authData?.profile} roles={authData?.roles || []} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
