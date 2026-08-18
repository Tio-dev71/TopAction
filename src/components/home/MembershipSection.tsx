"use client";

import { useState } from "react";
import { Check, ShieldCheck, Clock, Lock, Headphones, ChevronDown, ChevronRight, Trophy, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    id: "basic",
    name: "Cơ bản",
    price: "199.000đ",
    period: "/năm",
    target: "Dành cho cá nhân",
    features: [
      "Xác minh danh tính (Tích xanh)",
      "Tạo CLB (tối đa 1 CLB)",
      "Tạo sự kiện (tối đa 2 sự kiện/tháng)",
      "Đăng sân & lớp học",
      "Nhận thanh toán từ người tham gia",
      "Hỗ trợ cơ bản",
    ],
    buttonText: "Đăng ký ngay",
    buttonVariant: "default",
    badge: null,
  },
  {
    id: "advanced",
    name: "Nâng cao",
    price: "499.000đ",
    period: "/năm",
    target: "Dành cho HLV & CLB",
    features: [
      "Tất cả quyền lợi gói Cơ bản",
      "Tạo sự kiện (tối đa 10 sự kiện/tháng)",
      "Thống kê & quản lý nâng cao",
      "Ưu tiên hiển thị sự kiện",
      "Hỗ trợ ưu tiên",
    ],
    buttonText: "Đăng ký ngay",
    buttonVariant: "default",
    badge: { text: "Phổ biến", color: "bg-emerald-500 text-white" },
  },
  {
    id: "club",
    name: "CLB Verified",
    icon: <Medal className="w-6 h-6 text-amber-400 fill-amber-400" />,
    price: "1.299.000đ",
    period: "/năm",
    target: "Dành cho CLB",
    features: [
      "Tất cả quyền lợi gói Nâng cao",
      "Huy hiệu CLB Verified",
      "Fanpage & Website CLB",
      "Livestream & Check-in",
      "Hỗ trợ quảng bá sự kiện",
    ],
    buttonText: "Đăng ký ngay",
    buttonVariant: "default",
    badge: null,
  },
  {
    id: "organizer",
    name: "Organizer Pro",
    icon: <Trophy className="w-6 h-6 text-amber-500 fill-amber-500" />,
    price: "2.999.000đ",
    period: "/năm",
    target: "Dành cho đơn vị tổ chức",
    features: [
      "Tất cả quyền lợi CLB Verified",
      "Tổ chức giải chuyên nghiệp",
      "Quản lý trọng tài & VĐV",
      "Bán vé & nhận tài trợ",
      "Hỗ trợ 1:1 chuyên biệt",
    ],
    buttonText: "Đăng ký ngay",
    buttonVariant: "warning",
    badge: { text: "Tốt nhất", color: "bg-amber-500 text-white" },
    highlight: true,
  },
];

export function MembershipSection() {
  const [showCompare, setShowCompare] = useState(false);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            TopPlay Membership
            <ShieldCheck className="w-6 h-6 text-[#1d4ed8] fill-blue-50" />
          </h2>
          <p className="text-[15px] text-muted-foreground mt-2">
            Chọn gói phù hợp để tạo CLB, tổ chức sự kiện và tận hưởng nhiều đặc quyền hấp dẫn.
          </p>
        </div>
        <button 
          onClick={() => setShowCompare(!showCompare)}
          className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1d4ed8] hover:underline"
        >
          {showCompare ? "Ẩn bảng so sánh" : "So sánh chi tiết"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {PLANS.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative flex flex-col bg-white rounded-2xl p-6 border ${plan.highlight ? 'border-amber-400 shadow-md shadow-amber-500/10' : 'border-border/60 shadow-sm'} transition-transform hover:-translate-y-1`}
          >
            {plan.badge && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[12px] font-bold tracking-wide ${plan.badge.color}`}>
                {plan.badge.text}
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                {plan.name}
                {plan.icon && plan.icon}
              </h3>
              <div className="mt-4 flex items-baseline gap-1 text-foreground">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="text-[14px] font-semibold text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-[13px] text-muted-foreground mt-2 font-medium">{plan.target}</p>
            </div>

            <div className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0 h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-600 stroke-[3]" />
                    </div>
                    <span className="text-[13.5px] leading-snug text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <Button 
                className={`w-full h-11 rounded-xl font-bold text-[15px] ${
                  plan.buttonVariant === 'warning' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25' 
                    : 'bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-md shadow-blue-500/20'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border/40">
        {[
          { icon: ShieldCheck, title: "Xác minh danh tính", desc: "Bảo mật & an toàn" },
          { icon: Clock, title: "Hoàn tiền 100%", desc: "Trong 07 ngày" },
          { icon: Lock, title: "Thanh toán an toàn", desc: "PCI-DSS & SSL" },
          { icon: Headphones, title: "Hỗ trợ 24/7", desc: "Mọi lúc, mọi nơi" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground bg-secondary/30">
              <item.icon className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-foreground">{item.title}</p>
              <p className="text-[12px] text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show Compare Table (Mock placeholder for future implementation) */}
      {showCompare && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-bold mb-6 text-center">So sánh quyền lợi chi tiết</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse bg-white border border-border/50 rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-secondary/40 border-b border-border/50">
                  <th className="py-4 px-6 text-left font-bold text-foreground w-1/4">Quyền lợi nổi bật</th>
                  <th className="py-4 px-6 text-center font-bold text-foreground">Cơ bản</th>
                  <th className="py-4 px-6 text-center font-bold text-foreground">Nâng cao</th>
                  <th className="py-4 px-6 text-center font-bold text-foreground">CLB Verified</th>
                  <th className="py-4 px-6 text-center font-bold text-foreground">Organizer Pro</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {[
                  { name: "Tạo CLB (tối đa 1 CLB)", values: [true, true, true, true] },
                  { name: "Sự kiện tối đa / tháng", values: ["2 sự kiện", "10 sự kiện", "Không giới hạn", "Không giới hạn"] },
                  { name: "Đăng sân & lớp học", values: [true, true, true, true] },
                  { name: "Hỗ trợ cơ bản / ưu tiên", values: ["Hỗ trợ cơ bản", "Hỗ trợ ưu tiên", "Hỗ trợ ưu tiên 24/7", "Hỗ trợ ưu tiên 24/7"] },
                  { name: "Thống kê & báo cáo nâng cao", values: [false, true, true, true] },
                  { name: "Huy hiệu đặc biệt", values: ["Tích xanh cá nhân", "Huy hiệu CLB nhỏ", "CLB Verified", "Organizer Pro"] },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border/40 hover:bg-secondary/10">
                    <td className="py-4 px-6 font-semibold text-foreground/80">{row.name}</td>
                    {row.values.map((val, vIdx) => (
                      <td key={vIdx} className="py-4 px-6 text-center">
                        {typeof val === 'boolean' ? (
                          val ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground/30">-</span>
                        ) : (
                          <span className="font-medium text-foreground/90">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
