'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Menu, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import { toast } from 'sonner'
import { type UserRole, type DbProfile } from '@/lib/types/database'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  LayoutDashboard, Trophy, FileText, Users, Heart,
  ClipboardList, Image as ImageIcon, ScrollText, Settings,
} from 'lucide-react'

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

export function AdminHeader({
  user,
  roles,
}: {
  user: DbProfile | null | undefined
  roles: UserRole[]
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Get page title from pathname
  const getPageTitle = () => {
    const item = navItems.find(i =>
      i.href === '/admin' ? pathname === '/admin' : pathname.startsWith(i.href)
    )
    return item?.label || 'Quản trị'
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Đã đăng xuất')
    router.push('/dang-nhap')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/60 bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="sm" className="md:hidden" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b border-border/60 p-4">
              <SheetTitle className="flex items-center gap-2 text-left">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    <span className="text-primary">TOP</span>PLAY Admin
                  </span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="space-y-1 p-2">
              {navItems.map((item) => {
                const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-bold tracking-tight sm:text-xl">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Trang chủ</span>
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Thoát</span>
        </Button>
      </div>
    </header>
  )
}
