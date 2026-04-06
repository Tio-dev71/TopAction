"use client";

import { useActionState, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createDonation, getDonations, getTotalDonations } from "@/app/actions/donation";

function fmtMoney(n: number) {
  return n.toLocaleString("vi-VN") + " ₫";
}

function fmtTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} ngày trước`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours} giờ trước`;
  return "Vừa xong";
}

import { createClient } from "@/lib/supabase/client";

export function DonationWidget({
  tournamentId,
  slug,
}: {
  tournamentId: string;
  slug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data?.session);

        const [recent, sum] = await Promise.all([
          getDonations(tournamentId),
          getTotalDonations(tournamentId),
        ]);
        setDonations(recent);
        setTotal(sum);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tournamentId]);

  // Action state
  const [state, formAction, pending] = useActionState(createDonation, null);

  useEffect(() => {
    if (state?.redirect) {
      router.push(state.redirect);
    } else if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success("Tạo thông tin ủng hộ thành công! Vui lòng hoàn tất chuyển khoản.");
      setOpen(false);
      // Let's optimistic update the UI a bit (or re-fetch if we had realtime)
      // Since status is pending, it won't show in the 'confirmed' list yet.
    }
  }, [state, router]);

  const handleOpenClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push(`/dang-nhap?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setOpen(true);
  };

  return (
    <div id="donation-widget" className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold">
        <Heart className="h-4 w-4 text-destructive" />
        Ủng hộ gần đây
      </div>

      <div className="mt-3 space-y-3">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : donations.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Chưa có lượt ủng hộ nào.</p>
        ) : (
          donations.map((d) => (
            <div key={d.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {d.donor_name
                    ?.split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .slice(0, 2) || "AN"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{d.donor_name}</p>
                <p className="text-[11px] text-primary font-bold">{fmtMoney(d.amount)}</p>
                {d.message && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                    &ldquo;{d.message}&rdquo;
                  </p>
                )}
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {fmtTimeAgo(d.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      <div className="mt-4 rounded-lg bg-primary/5 p-3 text-center">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tổng ủng hộ</p>
        <p className="mt-0.5 text-lg font-extrabold text-primary">
          {loading ? "..." : fmtMoney(total)}
        </p>
      </div>

      <Button variant="outline" size="sm" className="mt-3 w-full gap-2" onClick={handleOpenClick}>
        <Heart className="h-3.5 w-3.5" />
        Ủng hộ ngay
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ủng hộ giải đấu</DialogTitle>
            <DialogDescription>
              Vui lòng điền thông tin để tạo lệnh ủng hộ. Trạng thái sẽ được cập nhật sau khi hoàn tất thanh toán.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="tournament_id" value={tournamentId} />
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="redirectPath" value={pathname} />

            <div className="space-y-2">
              <Label htmlFor="donor_name">Tên hiển thị</Label>
              <Input id="donor_name" name="donor_name" required placeholder="Nhập tên của bạn" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền ủng hộ (VNĐ)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="10000"
                step="10000"
                required
                placeholder="VD: 500000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Lời nhắn (không bắt buộc)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Chúc giải đấu thành công..."
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
                Hủy
              </Button>
              <Button type="submit" disabled={pending} className="gap-2">
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Tạo lệnh ủng hộ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
