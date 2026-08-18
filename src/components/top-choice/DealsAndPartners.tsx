import { Award, Star, CheckCircle, Tag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DealsAndPartners() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 mb-16">
      
      {/* Left Column: Deals & Partners */}
      <div className="flex-1 space-y-12">
        {/* Deals */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2 mb-6">
            Ưu đãi TOP Choice
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { discount: "Giảm 20%", title: "Sân Pickleball Stadium", img: "1622227432807-91eb59a23d9b" },
              { discount: "Giảm 15%", title: "Học phí với Coach Huy", img: "1599566150163-29194dcaad36" },
              { discount: "Giảm 10%", title: "Tất cả sản phẩm tại PickleHub", img: "1554068865-24cecd4e34b8" },
              { discount: "Giảm 100k", title: "Giải Vietnam Pickleball Open", img: "1552674605-15c21746360c" },
            ].map((deal, idx) => (
              <div key={idx} className="flex bg-white border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className="w-24 shrink-0 relative overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-${deal.img}?auto=format&fit=crop&w=200&q=80`} alt={deal.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-1.5 text-red-500 font-bold text-[13px] mb-1">
                    <Tag className="w-3.5 h-3.5" />
                    {deal.discount}
                  </div>
                  <h4 className="text-[14px] font-bold text-foreground line-clamp-1">{deal.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2 mb-6">
            Đối tác TOP Choice
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["JOOLA", "Zocker", "Facolos", "Kamito", "dink.", "VLOOP", "Mekong", "Goodfit"].map((partner, idx) => (
              <div key={idx} className="bg-white border border-border/60 rounded-xl h-20 flex items-center justify-center p-4 hover:border-[#1d4ed8]/30 transition-colors cursor-pointer group grayscale hover:grayscale-0">
                 <span className="font-black text-xl text-muted-foreground group-hover:text-[#0A1A3B] transition-colors">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Certification & Community Rating */}
      <div className="w-full lg:w-[320px] shrink-0 space-y-6">
        
        {/* Certification Sidebar */}
        <div className="bg-[#0A1A3B] text-white rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-[#0A1A3B]/20">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award className="w-32 h-32" />
           </div>
           
           <div className="relative z-10 flex flex-col items-center text-center">
              <h3 className="text-lg font-bold mb-6 w-full text-left border-b border-white/20 pb-4">Chứng nhận TOP Choice</h3>
              
              <div className="w-24 h-24 relative mb-4">
                <div className="absolute inset-0 flex items-center justify-center flex-col bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full border-4 border-[#0A1A3B] shadow-lg">
                  <span className="text-[8px] font-bold text-yellow-900 tracking-widest">TOP CHOICE</span>
                  <span className="text-xl font-black text-white drop-shadow-md">2026</span>
                </div>
              </div>

              <h4 className="text-lg font-extrabold mb-1">TopPlay Pickleball Club</h4>
              <p className="text-yellow-400 text-[13px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-6">
                <CheckCircle className="w-4 h-4" /> Đạt chứng nhận TOP Choice
              </p>

              <div className="w-full bg-white/10 rounded-xl p-4 text-left mb-6 backdrop-blur-sm border border-white/10">
                <p className="text-[11px] text-white/60 font-medium uppercase tracking-wider mb-1">Hạng mục</p>
                <p className="text-[14px] font-bold mb-3 text-yellow-400">Gold Club 2026</p>
                
                <p className="text-[11px] text-white/60 font-medium uppercase tracking-wider mb-1">Mã chứng nhận</p>
                <p className="text-[14px] font-mono font-bold mb-3">TPC-GOLD-2026-012</p>

                <p className="text-[11px] text-white/60 font-medium uppercase tracking-wider mb-1">Hiệu lực</p>
                <p className="text-[14px] font-semibold">01/01/2026 - 31/12/2026</p>
              </div>

              <Button className="w-full rounded-full bg-white text-[#0A1A3B] hover:bg-gray-100 font-bold h-11 border-0">
                Xem chi tiết
              </Button>
           </div>
        </div>

        {/* Community Rating */}
        <div className="bg-white border border-border/80 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[16px] font-bold text-foreground mb-6">Đánh giá từ cộng đồng</h3>
          
          <div className="flex items-center gap-6 mb-6">
             <div className="text-center">
               <span className="text-5xl font-black text-foreground block leading-none mb-2">4.8</span>
               <div className="flex items-center justify-center text-yellow-400 mb-1">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400" />
               </div>
               <span className="text-[11px] text-muted-foreground font-medium">58.320 đánh giá</span>
             </div>
             
             <div className="flex-1 space-y-1.5">
               {[
                 { stars: 5, pct: 85 },
                 { stars: 4, pct: 10 },
                 { stars: 3, pct: 3 },
                 { stars: 2, pct: 1 },
                 { stars: 1, pct: 1 },
               ].map((row) => (
                 <div key={row.stars} className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                   <span className="w-8 text-right">{row.stars} sao</span>
                   <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${row.pct}%` }}></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <Button className="w-full rounded-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold h-11">
            Viết đánh giá
          </Button>
        </div>

      </div>
    </div>
  );
}
