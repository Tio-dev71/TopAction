import { Star, CheckCircle } from "lucide-react";

export function HighestRated() {
  const items = [
    { name: "Stadium Pickleball", score: "9.7", reviews: 312, location: "Nam Từ Liêm, Hà Nội", tag: "Sân trong nhà", tag2: "10 sân" },
    { name: "TopPlay Academy", score: "9.6", reviews: 180, location: "Quận 2, TP.HCM", tag: "Lớp học", tag2: "Chuyên nghiệp" },
    { name: "Coach Khang", score: "9.9", reviews: 85, location: "Cầu Giấy, Hà Nội", tag: "HLV", tag2: "Chứng nhận quốc tế" },
    { name: "PickleHub Shop", score: "9.8", reviews: 450, location: "Toàn quốc", tag: "Shop", tag2: "Chính hãng" },
  ];

  return (
    <div className="mb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Được đánh giá cao nhất
          </h2>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {["Tất cả", "CLB", "Sân", "HLV", "Giải đấu", "Shop"].map((tab, idx) => (
             <button 
               key={tab} 
               className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap border transition-colors ${idx === 0 ? 'bg-[#0A1A3B] text-white border-[#0A1A3B]' : 'bg-white text-foreground border-border/60 hover:bg-secondary'}`}
             >
               {tab}
             </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col bg-white border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
            <div className="aspect-[4/3] w-full overflow-hidden relative">
              <img src={`https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80`} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex gap-1">
                <span className="bg-white/90 backdrop-blur-sm text-[#1d4ed8] text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
                  {item.tag}
                </span>
                <span className="bg-[#1d4ed8]/90 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
                  {item.tag2}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-[15px] font-bold text-foreground mb-1 line-clamp-1">{item.name}</h3>
              <p className="text-[12px] text-muted-foreground mb-3">{item.location}</p>
              
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-[14px] font-black">{item.score}</span>
                  <span className="text-[12px] text-muted-foreground font-medium">({item.reviews} đánh giá)</span>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
