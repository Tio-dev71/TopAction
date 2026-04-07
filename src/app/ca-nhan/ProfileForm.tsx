"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { Loader2, LogOut, Medal } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export function ProfileForm({ profile, stravaConnected = false }: { profile: any, stravaConnected?: boolean }) {
  const [state, formAction, pending] = useActionState(updateProfile, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success("Cập nhật thông tin thành công!");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đã đăng xuất.");
      router.push("/dang-nhap");
    } catch {
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="border-border/60 shadow-lg shadow-primary/5">
        <CardHeader className="text-center pb-6 border-b border-border/50">
          <div className="mx-auto mb-4 relative w-24 h-24 group">
            <Avatar className="w-24 h-24 ring-4 ring-background shadow-xl">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {profile.full_name
                  ? profile.full_name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-chart-2 text-white p-1.5 rounded-full shadow-lg">
              <Medal className="w-5 h-5" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight">Hồ sơ cá nhân</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">{profile.email}</p>
        </CardHeader>
        
        <CardContent className="pt-8">
          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Họ và tên</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile.full_name}
                  required
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={profile.phone || ""}
                  placeholder="0912345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Thành phố</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={profile.city || ""}
                  placeholder="TP. Hồ Chí Minh"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="club_name">CLB / Nhóm chạy</Label>
                <Input
                  id="club_name"
                  name="club_name"
                  defaultValue={profile.club_name || ""}
                  placeholder="SRC Runner"
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center border-t border-border/50">
              <Button type="button" variant="destructive" className="w-full sm:w-auto gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </Button>
              <div className="flex-1" />
              <Button type="submit" disabled={pending} className="w-full sm:w-auto shadow-md shadow-primary/20 gap-2">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Cập nhật thông tin
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8 border-border/60 shadow-lg shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Ứng dụng liên kết</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Kết nối tài khoản của bạn để đồng bộ kết quả thi đấu tự động.</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FC4C02] rounded-xl flex items-center justify-center text-white shadow-md">
                {/* Simple Strava SVG */}
                <svg viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8">
                  <path d="M141.56 220.16L214.36 74.32l73.12 145.84h88.64L214.36 -0.08l-161.84 322.96h88.64l40.4-102.72z m145.44 0l40.4 102.72 40.4-102.72h88.64l-129.04 291.92-129.04-291.92h88.64z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[15px]">Strava</p>
                <p className="text-sm text-muted-foreground">
                  {stravaConnected ? "Đã kết nối" : "Chưa kết nối"}
                </p>
              </div>
            </div>
            {stravaConnected ? (
              <Button variant="outline" size="sm" className="text-muted-foreground" onClick={() => router.push('/api/auth/strava/disconnect')}>
                Tạm ngưng
              </Button>
            ) : (
              <Button size="sm" className="bg-[#FC4C02] hover:bg-[#FC4C02]/90 text-white" onClick={() => router.push('/api/auth/strava')}>
                Kết nối ngay
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
