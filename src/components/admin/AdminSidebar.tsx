'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Trophy,
  FileText,
  Users,
  Heart,
  ClipboardList,
  Image as ImageIcon,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { type UserRole, type DbProfile } from '@/lib/types/database'

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/giai-dau', label: 'Giải đấu', icon: Trophy },
  { href: '/admin/bai-viet', label: 'Bài viết', icon: FileText },
  { href: '/admin/dang-ky', label: 'Đăng ký', icon: ClipboardList },
  { href: '/admin/ung-ho', label: 'Ủng hộ', icon: Heart },
  { href: '/admin/nguoi-dung', label: 'Người dùng', icon: Users },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/audit-logs', label: 'Audit Log', icon: ScrollText },
  { href: '/admin/cai-dat', label: 'Cài đặt', icon: Settings },
]

export function AdminSidebar({
  user,
  roles,
}: {
  user: DbProfile | null | undefined
  roles: UserRole[]
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border/60 bg-card transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
        }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border/60 px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-primary">TOP</span>ACTION
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      {!collapsed && user && (
        <div className="border-t border-border/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {user.full_name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.full_name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {roles.includes('super_admin') ? 'Super Admin' : roles[0] || 'User'}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-3 block rounded-lg border border-border/60 py-1.5 text-center text-xs text-muted-foreground transition-colors hover:bg-secondary"
          >
            ← Về trang chủ
          </Link>
        </div>
      )}
    </aside>
  )
}
