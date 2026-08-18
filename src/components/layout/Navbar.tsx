"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Menu, X, Bell, Search, User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/app/actions/auth";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Sự kiện", href: "/su-kien" },
  { label: "Pickleball", href: "/pickleball" },
  { label: "Sân thể thao", href: "/san-the-thao" },
  { label: "Bảng xếp hạng", href: "/bang-xep-hang" },
  { label: "Cộng đồng", href: "/cong-dong" },
  { label: "TOP Choice", href: "/top-choice" },
  { label: "Tin tức", href: "/tin-tuc" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đã đăng xuất.");
      router.refresh();
    } catch (e) {
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 xl:px-8 gap-4">
        {/* LEFT: Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <img
            src="/favicon.ico" // Need to update to full logo if available, or keep for now
            alt="TOPPLAY"
            className="h-32 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* CENTER: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-[15px] font-bold whitespace-nowrap transition-colors ${isActive ? "text-[#1d4ed8]" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-[-16px] left-0 w-full h-[3px] bg-[#1d4ed8] rounded-t-md"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 justify-end min-w-[200px]">
          <button className="hidden lg:flex relative p-2.5 text-foreground hover:bg-secondary rounded-full transition-colors">
            <Search className="h-[20px] w-[20px] stroke-[2.5]" />
          </button>

          <button className="relative p-2.5 text-foreground hover:bg-secondary rounded-full transition-colors">
            <Bell className="h-[20px] w-[20px] stroke-[2.5]" />
            <span className="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-red-500 border border-background"></span>
          </button>

          <div className="hidden sm:flex items-center">
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <Link href="/ca-nhan">
                    <Button variant="ghost" className="gap-2.5 font-bold hover:bg-secondary rounded-full pl-2 pr-4 h-10">
                      <div className="h-7 w-7 rounded-full bg-secondary overflow-hidden flex items-center justify-center border border-border/80">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="truncate max-w-[120px] text-[14px]">{user.user_metadata?.full_name || 'Nguyễn Văn A'}</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/dang-nhap" passHref>
                    <Button variant="ghost" className="rounded-full px-5 font-bold text-[#1d4ed8] hover:bg-secondary transition-colors text-[14px] h-10">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/dang-ky" passHref>
                    <Button className="rounded-full px-6 font-bold bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-sm shadow-blue-500/20 text-[14px] h-10">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-[22px] w-[22px]" /> : <Menu className="h-[22px] w-[22px]" />}
          </button>
        </div>
      </div>



      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden absolute w-full shadow-xl">
          <div className="space-y-0.5 px-3 py-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-[15px] font-semibold transition-colors ${isActive ? "bg-primary/5 text-[#1d4ed8]" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-4 pt-4 border-t border-border/50 px-1">
              {!loading && (
                user ? (
                  <div className="flex flex-col gap-3">
                    <Link href="/ca-nhan" onClick={() => setMobileOpen(false)}>
                      <Button variant="secondary" className="w-full gap-2 rounded-xl h-11 text-[15px] font-semibold justify-start px-4">
                        <User className="h-4 w-4 text-[#1d4ed8]" />
                        {user.user_metadata?.full_name || 'Hồ sơ cá nhân'}
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full gap-2 rounded-xl h-11 text-[15px] font-semibold text-destructive hover:bg-destructive/5 hover:text-destructive justify-start px-4" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/dang-nhap" passHref onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl h-11 text-[15px] font-semibold text-[#1d4ed8] border-primary/20 bg-primary/5 hover:bg-primary/10">
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/dang-ky" passHref onClick={() => setMobileOpen(false)}>
                      <Button className="w-full rounded-xl h-11 text-[15px] font-semibold shadow-md shadow-primary/20 bg-[#1d4ed8] text-white">
                        Đăng ký
                      </Button>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
