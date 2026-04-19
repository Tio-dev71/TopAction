"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { Heart, Loader2, Sparkles, Copy, CheckCircle2, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { createDonation, getDonationsForTournament } from "@/app/actions/donation";
import { simulateDonationPayment } from "@/app/actions/mockPayment";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { useNotificationSound } from "@/hooks/useNotificationSound";

function fmtMoney(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

function fmtTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} ngày trước`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours} giờ trước`;
  const mins = Math.floor(diff / 60000);
  if (mins > 0) return `${mins} phút trước`;
  return "Vừa xong";
}

export function DonationWidget({
  tournamentId,
  slug,
  initialDonations = [],
  initialTotal = 0,
}: {
  tournamentId: string;
  slug: string;
  initialDonations?: any[];
  initialTotal?: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [bankingInfo, setBankingInfo] = useState<{ amount: number; code: string } | null>(null);

  const [donations, setDonations] = useState<any[]>(initialDonations);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(initialDonations.length === 0);
  const [newDonationId, setNewDonationId] = useState<string | null>(null);
  const [pulseTotal, setPulseTotal] = useState(false);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);

  const { play: playSound } = useNotificationSound();
  const mountedRef = useRef(false);

  // Constants that would normally come from .env
  const bankId = process.env.NEXT_PUBLIC_BANK_ID || "MB";
  const accountNo = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO || "0977831621";
  const accountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "NGUYEN DINH THO";

  // Fetch donations on mount if not provided
  useEffect(() => {
    mountedRef.current = true;
    if (initialDonations.length > 0) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const recent = await getDonationsForTournament(tournamentId);
        setDonations(recent);
        setTotal(recent.reduce((sum: number, d: any) => sum + (d.amount || 0), 0));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tournamentId, initialDonations.length]);

  // 🔴 REALTIME: Subscribe to donations table for this tournament
  useRealtimeTable({
    table: "donations",
    filter: `tournament_id=eq.${tournamentId}`,
    onUpdate: (payload) => {
      const newRow = payload.new as any;
      const oldRow = payload.old as any;

      if (newRow.status === "paid" && oldRow.status !== "paid") {
        const donationEntry = {
          id: newRow.id,
          donor_name: newRow.is_anonymous ? "Ẩn danh" : newRow.donor_name,
          amount: newRow.amount,
          message: newRow.message,
          is_anonymous: newRow.is_anonymous,
          created_at: newRow.created_at,
        };

        setDonations((prev) => {
          if (prev.some((d) => d.id === newRow.id)) return prev;
          return [donationEntry, ...prev];
        });

        setTotal((prev) => prev + (newRow.amount || 0));

        setNewDonationId(newRow.id);
        setPulseTotal(true);
        setTimeout(() => setNewDonationId(null), 3000);
        setTimeout(() => setPulseTotal(false), 2000);

        playSound();

        // If the current user was waiting for this payment, close the QR modal
        if (bankingInfo && bankingInfo.code === newRow.donation_code) {
          setQrOpen(false);
          setBankingInfo(null);
        }

        const name = newRow.is_anonymous ? "Ẩn danh" : newRow.donor_name;
        toast.success(
          `💖 ${name} vừa ủng hộ ${fmtMoney(newRow.amount)}!`,
          {
            description: newRow.message || "Cảm ơn sự ủng hộ!",
            duration: 5000,
          }
        );
      }
    },
    onInsert: (payload) => {
      const newRow = payload.new as any;
      if (newRow.status === "paid") {
        const donationEntry = {
          id: newRow.id,
          donor_name: newRow.is_anonymous ? "Ẩn danh" : newRow.donor_name,
          amount: newRow.amount,
          message: newRow.message,
          is_anonymous: newRow.is_anonymous,
          created_at: newRow.created_at,
        };

        setDonations((prev) => {
          if (prev.some((d) => d.id === newRow.id)) return prev;
          return [donationEntry, ...prev];
        });

        setTotal((prev) => prev + (newRow.amount || 0));
        setNewDonationId(newRow.id);
        setPulseTotal(true);
        setTimeout(() => setNewDonationId(null), 3000);
        setTimeout(() => setPulseTotal(false), 2000);
        playSound();

        const name = newRow.is_anonymous ? "Ẩn danh" : newRow.donor_name;
        toast.success(
          `💖 ${name} vừa ủng hộ ${fmtMoney(newRow.amount)}!`,
          {
            description: newRow.message || "Cảm ơn sự ủng hộ!",
            duration: 5000,
          }
        );
      }
    },
  });

  // Action state
  const [state, formAction, pending] = useActionState(createDonation, null);

  useEffect(() => {
    if (state?.success && 'isManualBanking' in state && state.isManualBanking) {
      setOpen(false); // Đóng form nhập thông tin
      setBankingInfo({ amount: state.amount || 0, code: state.donationCode });
      setQrOpen(true); // Mở form quét QR
    } else if (state?.success && 'paymentError' in state && state.paymentError) {
      toast.warning("Lỗi tạo thanh toán: " + state.paymentError);
      setOpen(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Đã sao chép: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulatePayment = async () => {
    if (!bankingInfo?.code) return;
    setSimulating(true);
    const res = await simulateDonationPayment(bankingInfo.code);
    if (res.error) {
      toast.error(res.error);
      setSimulating(false);
    } else {
      // It will auto-close via realtime if we want, but we can also forcefully dismiss
      setSimulating(false);
    }
  };

  return (
    <div id="donation-widget" className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden flex flex-col">
      {/* Cấu trúc giống ảnh vRace */}
      <div className="p-6 text-center border-b border-border/40">
        <h2 className="text-sm font-bold text-muted-foreground flex items-center justify-center gap-2 mb-2">
          Ủng hộ quỹ
          <Heart className="h-4 w-4 text-primary" fill="currentColor" />
        </h2>

        <div className={`transition-all duration-700 ${pulseTotal ? "scale-110" : ""}`}>
          <p className="text-4xl font-extrabold text-primary tracking-tight">
            {loading ? "..." : fmtMoney(total)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">được quyên góp</p>
        </div>

        <div className="mt-4 pt-4 border-t border-border/40 text-left">
          <p className="text-sm text-foreground/80 mb-2">
            Đã có <strong className="text-primary">{donations.length || 0} lượt ủng hộ</strong> cho quỹ
          </p>

          <div className="flex gap-2">
            <Button className="flex-1 text-base font-bold h-12" onClick={() => setOpen(true)}>
              Ủng hộ ngay
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Quyên góp từ 10.000 đ - 20.000.000 đ
          </p>
        </div>
      </div>

      <div className="p-5 bg-secondary/10 flex-1">
        <div className="flex items-center gap-2 text-sm font-bold mb-4">
          <Heart className="h-4 w-4 text-destructive" />
          Ủng hộ gần đây
          <span className="relative ml-auto flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span className="text-[10px] font-normal text-green-600">LIVE</span>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : donations.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Chưa có lượt ủng hộ nào.</p>
          ) : (
            donations.map((d, i) => (
              <div
                key={d.id || i}
                className={`flex items-start gap-3 rounded-lg p-2 transition-all duration-500 ${newDonationId === d.id
                  ? "bg-green-50 dark:bg-green-950/30 ring-1 ring-green-200 dark:ring-green-800 scale-[1.02]"
                  : ""
                  }`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    {d.donor_name
                      ?.split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2) || "AN"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold truncate">{d.donor_name}</p>
                    {newDonationId === d.id && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 text-[9px] font-bold text-green-700 dark:text-green-400 animate-pulse">
                        <Sparkles className="h-2.5 w-2.5" />
                        MỚI
                      </span>
                    )}
                  </div>
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
      </div>

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ủng hộ giải đấu</DialogTitle>
            <DialogDescription>
              Vui lòng nhập thông tin để nhận mã QR chuyển khoản.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="tournament_id" value={tournamentId} />

            <div className="space-y-2">
              <Label htmlFor="donor_name">Tên hiển thị *</Label>
              <Input id="donor_name" name="donor_name" required placeholder="Nhập tên của bạn" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-muted-foreground font-normal">(để nhận biên lai, không bắt buộc)</span></Label>
              <Input id="email" name="email" type="email" placeholder="email@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền ủng hộ (VNĐ) *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="10000"
                step="10000"
                required
                placeholder="VD: 500000"
                className="text-lg font-bold"
              />
              <div className="flex gap-2">
                {[50000, 100000, 200000, 500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className="flex-1 rounded-lg border border-border/60 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).closest('form')?.querySelector('#amount') as HTMLInputElement;
                      if (input) input.value = amt.toString();
                    }}
                  >
                    {(amt / 1000).toLocaleString('vi-VN')}K
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Lời nhắn (không bắt buộc)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Chúc quỹ ngày càng phát triển..."
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="is_anonymous" name="is_anonymous" value="true" className="accent-primary h-4 w-4" />
              <Label htmlFor="is_anonymous" className="text-sm cursor-pointer">Ẩn danh trên bảng vàng</Label>
            </div>

            {state?.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
                Hủy
              </Button>
              <Button type="submit" disabled={pending} className="gap-2">
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Tiếp tục chuyển khoản <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Chuyển khoản</DialogTitle>
            <DialogDescription className="text-center">
              Quét mã QR bằng App ngân hàng bất kỳ để tự động điền thông tin.
            </DialogDescription>
          </DialogHeader>

          {bankingInfo && (
            <div className="space-y-6 pt-4">
              {/* QR Image */}
              <div className="flex justify-center p-4 bg-white rounded-xl border-2 border-primary/20 shadow-inner">
                {/* Image endpoint from VietQR.io */}
                <img
                  src={`https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${bankingInfo.amount}&addInfo=SAIBUOCNGHIATINH%20${bankingInfo.code}&accountName=${encodeURIComponent(accountName)}`}
                  alt="VietQR Chuyển khoản"
                  className="w-64 h-64 object-contain"
                />
              </div>

              {/* Banking Details */}
              <div className="space-y-3 bg-secondary/30 p-4 rounded-xl text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">Ngân hàng</span>
                  <span className="font-bold text-foreground">{bankId}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-muted-foreground mr-4">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold tracking-wider">{accountNo}</span>
                    <button
                      onClick={() => handleCopy(accountNo, 'account')}
                      className="text-primary hover:text-primary/80 transition-colors"
                      title="Copy"
                    >
                      {copiedField === 'account' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">Chủ tài khoản</span>
                  <span className="font-bold">{accountName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <span className="text-muted-foreground">Số tiền</span>
                  <span className="font-bold text-primary text-base">{fmtMoney(bankingInfo.amount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground mr-4">Nội dung <span className="text-[10px] text-destructive">(Bắt buộc)</span></span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-primary/10 px-2 py-0.5 rounded text-primary">
                      SAIBUOCNGHIATINH {bankingInfo.code}
                    </span>
                    <button
                      onClick={() => handleCopy(`SAIBUOCNGHIATINH ${bankingInfo.code}`, 'code')}
                      className="text-primary hover:text-primary/80 transition-colors"
                      title="Copy"
                    >
                      {copiedField === 'code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/60">
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Hệ thống đang chờ giao dịch. Sẽ tự động đóng khi thành công.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full font-medium" onClick={() => setQrOpen(false)}>
                    Đóng cửa sổ
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
