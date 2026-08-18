import { Ticket, Trophy, CalendarDays, User, BarChart2, Users, Award, ShieldCheck, Zap, HeartHandshake } from "lucide-react";

export function QuickAccess() {
  const ITEMS = [
    { title: "Đặt sân", subtitle: "Nhanh chóng", icon: Ticket },
    { title: "Đăng ký giải", subtitle: "Dễ dàng", icon: Trophy },
    { title: "Tìm lớp học", subtitle: "Theo trình độ", icon: CalendarDays },
    { title: "Tìm HLV", subtitle: "Chuyên nghiệp", icon: User },
    { title: "Bảng xếp hạng", subtitle: "Cập nhật mới nhất", icon: BarChart2 },
    { title: "Cộng đồng", subtitle: "Kết nối đam mê", icon: Users },
  ];

  const PROPOSITIONS = [
    { title: "Đa dạng lựa chọn", subtitle: "Hàng ngàn sân và sự kiện", icon: Award, color: "text-[#1d4ed8]", bg: "bg-blue-50" },
    { title: "Giá tốt nhất", subtitle: "Ưu đãi hấp dẫn mỗi ngày", icon: HeartHandshake, color: "text-green-600", bg: "bg-green-50" },
    { title: "Đặt nhanh chóng", subtitle: "Xác nhận tức thì", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "An toàn & Uy tín", subtitle: "Đối tác được xác thực", icon: ShieldCheck, color: "text-[#1d4ed8]", bg: "bg-blue-50" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Tiện ích nhanh</h2>
      </div>

      {/* Grid of quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
        {ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button key={idx} className="group flex flex-col items-center text-center p-6 rounded-3xl border border-border/60 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-primary/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50 text-primary mb-4 group-hover:bg-primary/5 transition-colors">
                <Icon className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-[15px] font-bold text-foreground leading-tight">{item.title}</h3>
              <p className="text-[12px] text-muted-foreground mt-1.5">{item.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROPOSITIONS.map((prop, idx) => {
          const Icon = prop.icon;
          return (
            <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-secondary/30 border border-border/40">
              <div className={`flex shrink-0 h-14 w-14 items-center justify-center rounded-full ${prop.bg} ${prop.color}`}>
                <Icon className="h-6 w-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-foreground">{prop.title}</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">{prop.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
