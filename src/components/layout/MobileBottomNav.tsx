"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Plus, Ticket, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Trang chủ", href: "/", icon: Home },
    { label: "Sự kiện", href: "/su-kien", icon: CalendarDays },
    { label: "Đặt sân", href: "/san-the-thao", icon: Ticket },
    { label: "Tài khoản", href: "/ca-nhan", icon: User },
  ];

  const Icon0 = NAV_ITEMS[0].icon;
  const Icon1 = NAV_ITEMS[1].icon;
  const Icon2 = NAV_ITEMS[2].icon;
  const Icon3 = NAV_ITEMS[3].icon;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between border-t border-border/60 bg-background/95 px-2 pb-safe pt-1 backdrop-blur-xl md:hidden">
      <Link
        href={NAV_ITEMS[0].href}
        className={`flex w-full flex-col items-center justify-center gap-1 ${
          pathname === NAV_ITEMS[0].href ? "text-[#1d4ed8]" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon0 className="h-5 w-5" />
        <span className="text-[10px] font-medium">{NAV_ITEMS[0].label}</span>
      </Link>

      <Link
        href={NAV_ITEMS[1].href}
        className={`flex w-full flex-col items-center justify-center gap-1 ${
          pathname.startsWith(NAV_ITEMS[1].href) ? "text-[#1d4ed8]" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon1 className="h-5 w-5" />
        <span className="text-[10px] font-medium">{NAV_ITEMS[1].label}</span>
      </Link>

      <div className="relative -top-5 flex w-full justify-center">
        <Link href="/tao-su-kien">
          <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1d4ed8] text-white shadow-lg shadow-primary/30 transition-transform active:scale-95">
            <Plus className="h-6 w-6" />
          </button>
        </Link>
        <span className="absolute -bottom-4 w-max text-[10px] font-medium text-muted-foreground">
          Đăng tin/Đăng giải
        </span>
      </div>

      <Link
        href={NAV_ITEMS[2].href}
        className={`flex w-full flex-col items-center justify-center gap-1 ${
          pathname.startsWith(NAV_ITEMS[2].href) ? "text-[#1d4ed8]" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon2 className="h-5 w-5" />
        <span className="text-[10px] font-medium">{NAV_ITEMS[2].label}</span>
      </Link>

      <Link
        href={NAV_ITEMS[3].href}
        className={`flex w-full flex-col items-center justify-center gap-1 ${
          pathname.startsWith(NAV_ITEMS[3].href) ? "text-[#1d4ed8]" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon3 className="h-5 w-5" />
        <span className="text-[10px] font-medium">{NAV_ITEMS[3].label}</span>
      </Link>
    </div>
  );
}
