import { Users, MapPin, User, Trophy, ShoppingBag, ShieldCheck, Briefcase, HeartPulse, ChevronRight } from "lucide-react";

export function CategoryNav() {
  const categories = [
    { icon: Users, title: "CLB", subtitle: "Pickleball" },
    { icon: MapPin, title: "Sân", subtitle: "Pickleball" },
    { icon: User, title: "HLV", subtitle: "Pickleball" },
    { icon: Trophy, title: "Giải đấu", subtitle: "Pickleball" },
    { icon: ShoppingBag, title: "Shop", subtitle: "Dụng cụ" },
    { icon: ShieldCheck, title: "Thương hiệu", subtitle: "Nổi bật" },
    { icon: Briefcase, title: "Doanh nghiệp", subtitle: "Đồng hành" },
    { icon: HeartPulse, title: "Bệnh viện", subtitle: "Thể thao" },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-16 pb-4">
      {categories.map((cat, idx) => (
        <button 
          key={idx} 
          className="flex items-center gap-3 bg-white border border-border/60 rounded-2xl p-3 min-w-[160px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary/50 text-primary flex items-center justify-center shrink-0 group-hover:bg-[#1d4ed8] group-hover:text-white transition-colors">
            <cat.icon className="w-5 h-5" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <h4 className="text-[14px] font-bold text-foreground leading-tight">{cat.title}</h4>
            <p className="text-[12px] text-muted-foreground truncate">{cat.subtitle}</p>
          </div>
        </button>
      ))}
      <button className="flex flex-col items-center justify-center bg-secondary/30 border border-border/60 rounded-2xl h-[66px] px-6 shadow-sm hover:bg-secondary/50 transition-colors group shrink-0">
         <span className="text-[13px] font-bold text-[#1d4ed8] group-hover:underline flex items-center gap-1">
           Xem tất cả
           <ChevronRight className="w-3 h-3" />
         </span>
      </button>
    </div>
  );
}
