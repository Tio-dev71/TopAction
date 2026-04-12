"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Headphones, MessageSquare, MapPin, Phone, Mail, FileText, CheckCircle, Globe, ShoppingBag } from "lucide-react";

import { FacebookEmbed } from "@/app/giai-dau/[slug]/FacebookEmbed";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("subscribers")
        .insert([{ email }]);

      if (error) {
        if (error.code === "23505") {
          toast.error("Email này đã đăng ký nhận tin rồi!");
        } else {
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
          console.error("Subscribe error:", error);
        }
      } else {
        toast.success("Đăng ký nhận bản tin thành công!");
        setEmail("");
      }
    } catch (err) {
      toast.error("Lỗi kết nối. Vui lòng kiểm tra lại.");
      console.error("Connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-primary text-white text-sm">
      {/* Top Banner Section */}
      <div className="border-b border-white/10 border-dashed">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-12 w-full lg:w-auto">
            {/* Hotline */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xs uppercase opacity-80">Hotline</span>
                <span className="font-bold text-xl text-white">092 172 4444</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-white/20"></div>

            {/* Advisory */}
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-white" />
              <span className="font-bold text-base leading-tight">
                Tư vấn cùng<br />chuyên gia
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-6 w-full lg:w-auto">
            {/* Newsletter text */}
            <div className="flex flex-col">
              <span className="font-bold text-base">Đăng ký nhận tin</span>
              <span className="text-xs">Để lại email để nhận ngay những ưu đãi nhé!</span>
            </div>
            {/* Newsletter input */}
            <form className="flex w-full md:w-auto relative" onSubmit={handleSubscribe}>
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                type="email"
                placeholder="Email của bạn"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 pr-24 bg-white/10 border-white/20 rounded-full focus-visible:ring-white text-white placeholder:text-white/50"
              />
              <Button
                type="submit"
                disabled={loading}
                className="absolute right-1 top-1 bottom-1 h-auto rounded-full bg-white text-primary hover:bg-white/90 px-6 font-semibold"
              >
                {loading ? "..." : "Gửi"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Column 1: Logo */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <Link href="/" className="inline-block relative">
              {/* Logo text updated to contrast with blue */}
              <div className="text-4xl font-extrabold uppercase text-white flex flex-col items-center lg:items-start tracking-tighter">
                <img src="/favicon.ico" alt="TOPPLAY" />
              </div>
            </Link>
          </div>

          {/* Column 2: Info */}
          <div className="flex flex-col space-y-3 text-xs leading-relaxed text-white/80">
            <h3 className="font-bold text-lg mb-2 text-white">TOPPLAY</h3>
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Số 8/24, Ngách 47, Ngõ 255, Đường Lĩnh Nam, Phường Vĩnh Hưng, Quận Hoàng Mai, Thành Phố Hà Nội</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <span>Hotline: 0921724444</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <span>Email: hi.topplay.vn@gmail.com</span>
            </p>
            <p className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0" />
              <span>Mã số doanh nghiệp: 0110057665</span>
            </p>
          </div>

          {/* Column 3: Policies */}
          <div className="flex flex-col space-y-2 text-white/80">
            <h3 className="font-bold text-lg mb-2 text-white">Chính sách</h3>
            {[
              "Chính sách bảo mật",
              "Hướng dẫn sử dụng STRAVA",
              "Hướng dẫn crop hoạt động trên STRAVA",
              "Hướng dẫn tạo tài khoản và kết nối STRAVA",
              "Phương thức thanh toán",
              "Điều kiện giao dịch chung",
              "Chính sách vận chuyển và giao nhận",
              "Hướng dẫn thanh toán VNPAY trên TOPPLAY"
            ].map((policy) => (
              <Link key={policy} href="#" className="hover:text-white transition-colors">
                {policy}
              </Link>
            ))}
          </div>

          {/* Column 4: Facebook & Sponsors */}
          <div className="flex flex-col gap-6">
            <div className="w-full overflow-hidden rounded bg-white shadow-lg">
              <FacebookEmbed
                pageUrl="https://www.facebook.com/100065482864072"
                pageName="TOPPLAY"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-wider text-white/60 uppercase">Compatible with</span>
              <div className="flex items-center gap-4">
                {/* Strava & VNPay placeholders */}
                <div className="font-extrabold text-[#fc4c02] text-xl tracking-tighter">STRAVA</div>
                <div className="flex font-bold text-[#005a9c] text-xl">
                  <span className="text-[#ed1c24]">VN</span>PAY
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-white/10 border-dashed">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/70">
            © Bản quyền thuộc về topmedia.vn
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </Link>
            <Link
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
            </Link>
            {[Globe, ShoppingBag].map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Icon className="h-4 w-4 text-white" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
