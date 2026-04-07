'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { assignRole, removeRole } from '@/app/actions/admin/users'
import { Shield, Plus, X } from 'lucide-react'

export function UserRoleManager({
  userId,
  allRoles,
  currentRoles,
}: {
  userId: string
  allRoles: any[]
  currentRoles: string[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAssign = async (roleId: string, roleCode: string) => {
    setLoading(true)
    const result = await assignRole(userId, roleId)
    setLoading(false)
    if (result.error) toast.error(result.error)
    else { toast.success(`Đã gán quyền ${roleCode}`); router.refresh() }
  }

  const handleRemove = async (roleCode: string) => {
    if (!confirm(`Xóa quyền ${roleCode}?`)) return
    setLoading(true)
    const result = await removeRole(userId, roleCode)
    setLoading(false)
    if (result.error) toast.error(result.error)
    else { toast.success(`Đã xóa quyền ${roleCode}`); router.refresh() }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="mb-4 text-sm font-bold flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        Quản lý vai trò
      </h3>

      {/* Current roles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {currentRoles.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có vai trò nào</p>
        ) : (
          currentRoles.map((code) => (
            <span key={code} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {code}
              <button
                onClick={() => handleRemove(code)}
                disabled={loading}
                className="ml-1 rounded-full p-0.5 hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Assignable roles */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground mb-2">Thêm vai trò:</p>
        <div className="flex flex-wrap gap-2">
          {allRoles
            .filter((r) => !currentRoles.includes(r.code))
            .map((role) => (
              <Button
                key={role.id}
                variant="outline"
                size="sm"
                disabled={loading}
                className="gap-1 text-xs"
                onClick={() => handleAssign(role.id, role.code)}
              >
                <Plus className="h-3 w-3" />
                {role.name}
              </Button>
            ))}
        </div>
      </div>
    </div>
  )
}
