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

export function ProfileForm({ profile }: { profile: any }) {
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
    </div>
  );
}
