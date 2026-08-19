import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, CheckCircle, Smartphone, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const PLANS: Record<string, { name: string; price: number; type: string }> = {
  advanced: { name: "Gói Nâng cao", price: 499000, type: "HLV & CLB" },
  club: { name: "Gói CLB Verified", price: 1299000, type: "CLB" },
  organizer: { name: "Gói Organizer Pro", price: 2999000, type: "Đơn vị tổ chức" },
};

export default async function MembershipPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const selectedPlan = plan && PLANS[plan] ? PLANS[plan] : null;

  if (!selectedPlan) {
    redirect("/");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dang-nhap?redirect=/");
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Thanh toán Gói Hội viên
            <ShieldCheck className="w-8 h-8 text-[#1d4ed8]" />
          </h1>
          <p className="text-muted-foreground mt-2">
            Nâng cấp tài khoản để tận hưởng đặc quyền tổ chức sự kiện và quản lý cộng đồng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột trái: Thông tin chuyển khoản */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6">Thông tin chuyển khoản</h2>
              
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-secondary/20 p-6 rounded-2xl border border-border/60">
                <div className="shrink-0 bg-white p-2 rounded-xl border border-border/40">
                  <img src="https://api.vietqr.io/image/970422-1961-W4n0ZpQ.jpg?accountName=TOPPLAY&amount=2000" alt="VietQR" className="w-40 h-40 object-cover" />
                </div>
                
                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Ngân hàng</span>
                    <span className="font-bold text-foreground text-lg">MB Bank</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Số tài khoản</span>
                    <span className="font-bold text-foreground text-lg tracking-widest">1961</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Tên tài khoản</span>
                    <span className="font-bold text-foreground">TOPPLAY VIET NAM</span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Nội dung chuyển khoản</span>
                    <div className="bg-amber-100 text-amber-900 px-3 py-2 rounded-lg font-mono font-bold text-sm select-all">
                      TOPPLAY {plan?.toUpperCase()} {user.email?.split("@")[0]}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 text-[13px] text-muted-foreground bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <Info className="w-5 h-5 text-[#1d4ed8] shrink-0 mt-0.5" />
                <p>
                  Hệ thống sẽ tự động kích hoạt gói <strong>{selectedPlan.name}</strong> cho tài khoản của bạn trong vòng 3-5 phút sau khi nhận được thanh toán thành công.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-border/80 text-foreground shadow-sm">
                  Trở lại
                </Button>
              </Link>
              <Link href="/thanh-toan/ket-qua?type=membership&code=MOCK-PAYMENT-123" className="flex-1">
                <Button className="w-full h-12 rounded-xl font-bold bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-md">
                  Tôi đã thanh toán
                </Button>
              </Link>
            </div>
          </div>

          {/* Cột phải: Hóa đơn */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Chi tiết thanh toán</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-muted-foreground">Tài khoản</span>
                  <span className="font-semibold">{user.user_metadata?.full_name || user.email}</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-muted-foreground">Gói đăng ký</span>
                  <span className="font-semibold text-primary">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-muted-foreground">Phân loại</span>
                  <span className="font-semibold">{selectedPlan.type}</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-muted-foreground">Thời hạn</span>
                  <span className="font-semibold">1 năm</span>
                </div>
              </div>
              
              <div className="border-t border-border/60 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-[14px] font-bold">Tổng thanh toán</span>
                  <span className="text-2xl font-extrabold text-[#1d4ed8]">
                    {selectedPlan.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Xác thực danh tính (Tích xanh)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Mở khóa các tính năng quản lý</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Bảo mật an toàn tuyệt đối</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
