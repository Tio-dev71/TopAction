import { Medal, Star, ShieldCheck, MapPin, Users, HeartHandshake, Zap, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const RANKINGS = [
  { rank: 1, name: "TopPlay Pickleball Club", score: "9.8", reviews: 256, location: "TP. Thủ Đức, TP.HCM", members: 486, medalColor: "bg-yellow-400" },
  { rank: 2, name: "Stadium Pickleball", score: "9.6", reviews: 182, location: "Nam Từ Liêm, Hà Nội", members: 320, medalColor: "bg-slate-300" },
  { rank: 3, name: "Vina Pickleball Center", score: "9.4", reviews: 145, location: "Quận 7, TP.HCM", members: 210, medalColor: "bg-amber-600" },
  { rank: 4, name: "Hanoi Pickleball Arena", score: "9.1", reviews: 98, location: "Cầu Giấy, Hà Nội", members: 156, medalColor: "bg-secondary" },
  { rank: 5, name: "Pro Pickleball", score: "9.0", reviews: 85, location: "Quận 1, TP.HCM", members: 120, medalColor: "bg-secondary" },
];

export function RankingSection() {
  return (
    <div className="mb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Bảng xếp hạng TOP Choice
          </h2>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {["CLB Pickleball", "Sân Pickleball", "HLV", "Giải đấu", "Shop"].map((tab, idx) => (
             <button 
               key={tab} 
               className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap border transition-colors ${idx === 0 ? 'bg-[#0A1A3B] text-white border-[#0A1A3B]' : 'bg-white text-foreground border-border/60 hover:bg-secondary'}`}
             >
               {tab}
             </button>
          ))}
          <a href="#" className="text-[13px] font-bold text-[#1d4ed8] ml-2 hover:underline whitespace-nowrap">Xem tất cả</a>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left: Ranking List */}
        <div className="flex-1 flex flex-col gap-4">
          {RANKINGS.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-border/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center shrink-0 text-white shadow-inner font-bold ${item.medalColor} ${idx > 2 ? 'text-muted-foreground' : ''}`}>
                 <span className="text-[11px] leading-none uppercase tracking-wider mb-0.5 opacity-80">Top</span>
                 <span className="text-lg leading-none">{item.rank}</span>
              </div>
              
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-secondary/50 overflow-hidden shrink-0 hidden sm:block">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&size=150`} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                <h3 className="text-[16px] sm:text-lg font-bold text-foreground mb-1 truncate flex items-center justify-center sm:justify-start gap-1.5">
                  {item.name}
                  {idx === 0 && <ShieldCheck className="w-4 h-4 text-[#1d4ed8]" />}
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground font-medium">
                   <div className="flex items-center gap-1">
                     <MapPin className="w-4 h-4" />
                     {item.location}
                   </div>
                   <div className="flex items-center gap-1">
                     <Users className="w-4 h-4" />
                     Thành viên: {item.members}
                   </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center sm:items-end justify-center w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-border/50">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-black text-foreground">{item.score}</span>
                  <div className="flex items-center text-yellow-400 pb-1">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                  </div>
                </div>
                <p className="text-[12px] text-muted-foreground font-medium">({item.reviews} đánh giá)</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Criteria Sidebar */}
        <div className="w-full xl:w-[320px] shrink-0">
          <div className="bg-[#f8fafc] border border-border/80 rounded-3xl p-6 h-full flex flex-col shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#1d4ed8]" />
              Tiêu chí đánh giá TOP Choice
            </h3>
            
            <div className="space-y-4 flex-1">
              {[
                { label: "Chất lượng cơ sở vật chất", pct: "25%" },
                { label: "Chất lượng dịch vụ", pct: "20%" },
                { label: "Huấn luyện & chuyên môn", pct: "20%" },
                { label: "Cộng đồng & hoạt động", pct: "15%" },
                { label: "Giá cả hợp lý", pct: "10%" },
                { label: "Đánh giá từ người chơi", pct: "10%" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-foreground/80">{item.label}</span>
                  <span className="text-[13px] font-bold bg-[#1d4ed8]/10 text-[#1d4ed8] px-2.5 py-1 rounded-md">{item.pct}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-border/80">
              <p className="text-[12px] text-muted-foreground italic text-center">
                Dữ liệu được cập nhật định kỳ bởi TopPlay AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
