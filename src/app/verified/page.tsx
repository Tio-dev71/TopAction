import { Metadata } from "next";
import Link from "next/link";
import { Check, Shield, TrendingUp, Search, UserCheck, Banknote, ShieldCheck } from "lucide-react";
import { MainContainer } from "@/components/layout/MainContainer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

export const metadata: Metadata = {
  title: "TopPlay Verified - Hệ thống Xác minh",
  description: "Xác minh danh tính, tạo uy tín, và mở khóa các tính năng quản lý thể thao chuyên nghiệp.",
};

const TIERS = [
  {
    name: "Khách (Cấp 0)",
    price: "Miễn phí",
    description: "Trải nghiệm các tính năng cơ bản của nền tảng.",
    badge: null,
    features: [
      "Xem sự kiện & giải đấu",
      "Đăng ký tham gia",
      "Đánh giá & Review",
      "Theo dõi Câu lạc bộ",
    ],
    notIncluded: [
      "Không được tạo Câu lạc bộ",
      "Không được tạo Giải đấu",
      "Không có huy hiệu xác minh"
    ],
    buttonText: "Bắt đầu miễn phí",
    href: "/dang-ky",
    popular: false,
  },
  {
    name: "Tích Xanh Cá Nhân",
    price: "199k - 499k",
    period: "/ năm",
    description: "Mở khóa quyền năng tổ chức sự kiện cá nhân.",
    badge: <VerifiedBadge type="personal" className="mt-2" />,
    features: [
      "Mọi quyền lợi của Cấp 0",
      "Tạo & Quản lý Câu lạc bộ",
      "Tạo sự kiện, lớp học quy mô nhỏ",
      "Nhận thanh toán, thu phí",
      "Huy hiệu Tích xanh TopPlay",
      "Tham gia xếp hạng Trust Score",
    ],
    notIncluded: [
      "Không tổ chức giải quy mô lớn"
    ],
    buttonText: "Xác minh ngay",
    href: "/verified/onboarding?tier=personal",
    popular: true,
  },
  {
    name: "Câu Lạc Bộ (Cấp 2)",
    price: "999k - 2.990k",
    period: "/ năm",
    description: "Khẳng định uy tín cho tổ chức và địa điểm thể thao.",
    badge: <VerifiedBadge type="club" className="mt-2" />,
    features: [
      "Tất cả quyền lợi Tích xanh",
      "Xác minh Pháp nhân / Địa điểm",
      "Đăng sân & Quản lý đặt lịch",
      "Mở rộng giới hạn sự kiện",
      "Huy hiệu CLB Verified",
      "Hỗ trợ kỹ thuật ưu tiên",
    ],
    buttonText: "Đăng ký CLB",
    href: "/verified/onboarding?tier=club",
    popular: false,
  },
  {
    name: "Đơn vị Tổ chức (Cấp 3)",
    price: "2.990k - 9.900k",
    period: "/ năm",
    description: "Giải pháp toàn diện cho các đơn vị sự kiện lớn.",
    badge: <VerifiedBadge type="organizer" className="mt-2" />,
    features: [
      "Tổ chức giải đấu quy mô lớn",
      "Nhận tài trợ, Bán vé chuyên nghiệp",
      "Hệ thống Check-in QR code",
      "Quản lý VĐV & Trọng tài",
      "Tích hợp Livestream",
      "Huy hiệu Organizer Verified",
    ],
    buttonText: "Liên hệ đối tác",
    href: "/verified/onboarding?tier=organizer",
    popular: false,
  },
];

export default function VerifiedPage() {
  return (
    <>
      <Navbar />
      <div className="bg-[#f8fafc] min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#004e92] pt-24 pb-32">
          <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1552674605-15c21746360c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#004e92] to-transparent z-10"></div>
          <MainContainer className="relative z-20 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <ShieldCheck className="w-5 h-5 text-blue-300" />
              <span className="text-sm font-semibold tracking-wide">TOPPLAY VERIFIED SYSTEM</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Xây dựng cộng đồng thể thao <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-200">
                Minh bạch & Đáng tin cậy
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-10">
              TopPlay Verified không chỉ là một dấu tích xanh. Đó là lời cam kết về uy tín, là lá chắn bảo vệ cộng đồng khỏi gian lận, và là chìa khóa mở ra các công cụ quản lý thể thao chuyên nghiệp nhất.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-base rounded-full bg-white text-[#004e92] hover:bg-white/90 font-bold w-full sm:w-auto shadow-xl">
                Bắt đầu xác minh
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-white/30 text-white hover:bg-white/10 font-bold w-full sm:w-auto bg-transparent">
                Tìm hiểu thêm
              </Button>
            </div>
          </MainContainer>
        </section>

        {/* Why Verify? */}
        <section className="py-24 bg-white relative z-30 -mt-8 rounded-t-[32px] sm:rounded-t-[48px] shadow-sm">
          <MainContainer>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-foreground mb-4">Tại sao cần xác minh?</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Hệ thống bảo mật 3 lớp kết hợp điểm tín nhiệm (Trust Score) giúp TopPlay trở thành nền tảng thể thao sạch nhất Việt Nam.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-secondary/30 p-8 rounded-[24px] border border-border/50 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Xác thực Định danh (eKYC)</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  Ngăn chặn hoàn toàn tài khoản giả mạo bằng công nghệ nhận diện khuôn mặt và CCCD tự động.
                </p>
              </div>
              <div className="bg-secondary/30 p-8 rounded-[24px] border border-border/50 text-center">
                <div className="w-16 h-16 mx-auto bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                  <Banknote className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Ký quỹ Bảo vệ (Refundable)</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  Quỹ bảo vệ người dùng lên đến 1.000.000đ khi tạo giải, hoàn trả 100% khi bạn tuân thủ đúng cam kết tổ chức.
                </p>
              </div>
              <div className="bg-secondary/30 p-8 rounded-[24px] border border-border/50 text-center">
                <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Điểm Uy Tín (Trust Score)</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  Cơ chế cộng trừ điểm dựa trên đánh giá người tham gia. Điểm càng cao, càng mở khóa nhiều đặc quyền.
                </p>
              </div>
            </div>
          </MainContainer>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-[#f8fafc]">
          <MainContainer>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-foreground mb-4">Chọn cấp độ xác minh của bạn</h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Phí quản lý được dùng để duy trì hệ thống kiểm duyệt và nâng cấp công cụ tổ chức sự kiện chuyên nghiệp cho bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
              {TIERS.map((tier, idx) => (
                <div 
                  key={idx} 
                  className={`relative flex flex-col bg-white rounded-[24px] p-6 lg:p-8 transition-transform hover:-translate-y-2 hover:shadow-xl ${
                    tier.popular 
                      ? "border-2 border-primary shadow-lg scale-100 xl:scale-105 z-10" 
                      : "border border-border/60 shadow-sm"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-primary text-white text-[12px] font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                        Phổ biến nhất
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">{tier.name}</h3>
                    {tier.badge}
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-foreground tracking-tight">{tier.price}</span>
                      {tier.period && <span className="text-muted-foreground font-medium">{tier.period}</span>}
                    </div>
                    <p className="text-[13px] text-muted-foreground mt-3">{tier.description}</p>
                  </div>

                  <div className="flex-1 space-y-4 mb-8">
                    {tier.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[14px] text-foreground font-medium leading-snug">{feat}</span>
                      </div>
                    ))}
                    {tier.notIncluded?.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 opacity-50">
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </div>
                        <span className="text-[14px] text-foreground font-medium leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={tier.href}>
                    <Button 
                      variant={tier.popular ? "default" : "outline"} 
                      className={`w-full h-12 rounded-xl font-bold text-[14px] ${
                        tier.popular ? "bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-md shadow-primary/25" : "border-border/80 hover:bg-secondary"
                      }`}
                    >
                      {tier.buttonText}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </MainContainer>
        </section>
      </div>
      <Footer />
    </>
  );
}
