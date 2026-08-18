import { Trophy, TrendingUp, HelpCircle, HeartPulse, Flag } from "lucide-react";

export function NewsHeader({ activeCategory, setActiveCategory }: { activeCategory: string, setActiveCategory: (c: string) => void }) {
  const CATEGORIES = [
    { id: "Mới nhất", label: "Mới nhất", icon: TrendingUp },
    { id: "Pickleball", label: "Pickleball", icon: Trophy },
    { id: "Bóng đá", label: "Bóng đá", icon: Flag },
    { id: "Chạy bộ", label: "Chạy bộ", icon: TrendingUp },
    { id: "Kiến thức", label: "Kiến thức", icon: HelpCircle },
    { id: "Đời sống", label: "Đời sống", icon: HeartPulse },
  ];

  return (
    <div className="mb-10 text-center relative border-b border-border/60 pb-8">
      <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-foreground mb-4">
        Tin tức <span className="text-[#1d4ed8]">Thể thao</span>
      </h1>
      <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
        Cập nhật nhanh chóng, chuyên sâu và chính xác các thông tin thể thao trong nước và quốc tế. Đặc biệt chuyên trang về Pickleball.
      </p>

      {/* Categories */}
      <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[14px] whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#0A1A3B] text-white" 
                  : "bg-secondary/40 text-foreground border border-transparent hover:bg-secondary hover:border-border/60"
              }`}
            >
              <cat.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
