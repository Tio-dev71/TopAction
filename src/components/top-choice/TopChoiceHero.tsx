import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopChoiceHero() {
  return (
    <div className="relative w-full rounded-[24px] overflow-hidden bg-[#0A1A3B] text-white shadow-lg shadow-[#0A1A3B]/20 mb-12 flex flex-col lg:flex-row min-h-[480px]">
      {/* Background Image for Center/Right */}
      <div className="absolute inset-0 lg:left-1/3 z-0">
        <img 
          src="https://images.unsplash.com/photo-1622227432807-91eb59a23d9b?auto=format&fit=crop&w=1200&q=80" 
          alt="Pickleball" 
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A3B] via-[#0A1A3B]/80 to-transparent lg:block hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A3B] via-[#0A1A3B]/80 to-transparent lg:hidden block"></div>
      </div>

      {/* LEFT: Intro & Stats */}
      <div className="relative z-10 w-full lg:w-1/3 p-8 lg:p-12 flex flex-col justify-between border-r border-white/10 bg-[#0A1A3B]/90 lg:bg-transparent">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-[12px] font-bold tracking-widest uppercase mb-6 border border-yellow-500/30">
             TopPlay Verified
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
            TOP <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">CHOICE</span>
          </h1>
          <p className="text-lg text-white/80 font-medium leading-relaxed max-w-[280px]">
            Nơi tìm kiếm những lựa chọn tốt nhất cho người chơi.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-12">
          <div>
            <p className="text-3xl font-black text-white">1.245</p>
            <p className="text-[12px] text-white/60 font-medium uppercase tracking-wider mt-1">Đơn vị được đánh giá</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">58.320</p>
            <p className="text-[12px] text-white/60 font-medium uppercase tracking-wider mt-1">Đánh giá & nhận xét</p>
          </div>
          <div>
            <p className="text-3xl font-black text-yellow-400">98.6%</p>
            <p className="text-[12px] text-white/60 font-medium uppercase tracking-wider mt-1">Hài lòng & đề xuất</p>
          </div>
        </div>
      </div>

      {/* CENTER: Search */}
      <div className="relative z-10 flex-1 p-8 lg:p-12 flex flex-col justify-center items-center text-center">
         <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-white shadow-sm">
           Khám phá các điểm đến chất lượng nhất
         </h2>
         
         <div className="w-full max-w-xl relative flex items-center bg-white rounded-full p-1.5 shadow-2xl">
           <div className="absolute left-6 text-muted-foreground">
             <Search className="w-5 h-5" />
           </div>
           <input 
             type="text" 
             placeholder="Tìm CLB, sân, HLV, giải đấu..." 
             className="w-full bg-transparent border-none focus:outline-none focus:ring-0 pl-14 pr-4 py-3 text-foreground font-medium text-[15px]"
           />
           <Button className="rounded-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold px-8 py-6 h-auto text-[15px]">
             Tìm kiếm
           </Button>
         </div>

         <div className="mt-8 flex flex-wrap justify-center items-center gap-2.5 text-[13px] font-medium text-white/80">
            <span>Tìm kiếm phổ biến:</span>
            {["Sân Pickleball", "CLB Pickleball", "HLV", "Giải đấu", "Shop"].map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/10 backdrop-blur-sm">
                {tag}
              </span>
            ))}
         </div>
      </div>

      {/* RIGHT: Badge */}
      <div className="relative z-10 w-full lg:w-[280px] p-8 lg:p-12 flex flex-col items-center justify-center border-l border-white/10 bg-[#0A1A3B]/80 lg:bg-transparent backdrop-blur-sm text-center">
         <div className="w-32 h-32 relative mb-6">
           <img src="https://images.unsplash.com/photo-1614031449419-79a0ebf35dc8?auto=format&fit=crop&w=200&q=80" alt="Gold Badge" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" />
           {/* Fallback to styled CSS if image doesn't load/look good as badge */}
           <div className="absolute inset-0 flex items-center justify-center flex-col bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full border-4 border-white/20 shadow-xl shadow-yellow-500/20">
              <span className="text-[10px] font-bold text-yellow-900 tracking-widest">TOP CHOICE</span>
              <span className="text-2xl font-black text-white drop-shadow-md">2026</span>
           </div>
         </div>
         <h3 className="font-bold text-[16px] text-white tracking-widest leading-tight mb-2">
           ĐÁNG TIN CẬY<br/>CHẤT LƯỢNG<br/>XỨNG TẦM
         </h3>
         <div className="flex items-center gap-1 text-yellow-400 mt-2">
           <Star className="w-4 h-4 fill-yellow-400" />
           <Star className="w-4 h-4 fill-yellow-400" />
           <Star className="w-4 h-4 fill-yellow-400" />
           <Star className="w-4 h-4 fill-yellow-400" />
           <Star className="w-4 h-4 fill-yellow-400" />
         </div>
      </div>
    </div>
  );
}
