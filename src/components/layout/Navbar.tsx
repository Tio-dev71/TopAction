"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Menu, X, ArrowRight, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/app/actions/auth";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth state changes
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
      router.refresh(); // Refresh client router
    } catch (e) {
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
            <Trophy className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">TOP</span>PLAY
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Trang chủ", href: "/" },
            { label: "Giải đấu", href: "/#tournaments" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          <div className="ml-3 flex items-center min-w-[120px] justify-end">
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <Link href="/ca-nhan">
                    <Button variant="ghost" size="sm" className="gap-2 font-medium">
                      <User className="h-4 w-4" />
                      {user.user_metadata?.full_name || 'Cá nhân'}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                    Thoát
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/dang-nhap" passHref>
                  <Button size="sm" className="gap-2 shadow-md shadow-primary/20">
                    Đăng nhập
                    <ArrowRight className="h-4.5 w-4.5" />
                  </Button>
                </Link>
              )
            )}
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-3">
            {[
              { label: "Trang chủ", href: "/" },
              { label: "Giải đấu", href: "/#tournaments" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 min-h-[40px]">
              {!loading && (
                user ? (
                  <div className="flex flex-col gap-2">
                    <Link href="/ca-nhan" onClick={() => setMobileOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full gap-2">
                        <User className="h-4 w-4" />
                        Hồ sơ {user.user_metadata?.full_name ? `- ${user.user_metadata.full_name}` : ''}
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                      Thoát
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href="/dang-nhap" passHref onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full gap-2 shadow-md shadow-primary/20">
                      Đăng nhập
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
