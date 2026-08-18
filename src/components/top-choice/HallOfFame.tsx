import { Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HallOfFame() {
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          TOP Choice Hall of Fame
        </h2>
        <p className="text-[15px] text-muted-foreground mt-1">
          Vinh danh những đơn vị và cá nhân xuất sắc nhất năm 2025.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Large Card */}
        <div className="w-full lg:w-2/3 relative rounded-[24px] overflow-hidden group min-h-[400px]">
           <img 
             src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80" 
             alt="Club of the year" 
             className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
           
           <div className="absolute inset-0 p-8 flex flex-col justify-between">
             <div className="self-end bg-yellow-500 text-yellow-950 text-[12px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-yellow-500/20">
               <Trophy className="w-4 h-4" />
               CLB CỦA NĂM 2025
             </div>
             <div>
               <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">TopPlay Pickleball Club</h3>
               <p className="text-white/80 text-[15px] max-w-lg mb-6">
                 Với hơn 50.000 lượt đánh giá tích cực và hệ thống cơ sở vật chất đạt chuẩn quốc tế, TopPlay Pickleball Club xứng đáng là lá cờ đầu trong phong trào Pickleball Việt Nam.
               </p>
               <Button className="rounded-full bg-white text-[#0A1A3B] hover:bg-gray-100 font-bold px-6 border-0">
                 Xem hành trình <ArrowRight className="w-4 h-4 ml-1.5" />
               </Button>
             </div>
           </div>
        </div>

        {/* Small Cards */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="relative rounded-[24px] overflow-hidden group flex-1 min-h-[188px]">
             <img 
               src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80" 
               alt="Coach of the year" 
               className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
             <div className="absolute inset-0 p-6 flex flex-col justify-end">
               <div className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-1">HLV CỦA NĂM 2025</div>
               <h3 className="text-xl font-bold text-white mb-1">Coach Khang</h3>
               <p className="text-white/70 text-[13px] line-clamp-2">Đóng góp to lớn trong việc phổ cập Pickleball chuyên nghiệp.</p>
             </div>
          </div>
          
          <div className="relative rounded-[24px] overflow-hidden group flex-1 min-h-[188px]">
             <img 
               src="https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=600&q=80" 
               alt="Event of the year" 
               className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
             <div className="absolute inset-0 p-6 flex flex-col justify-end">
               <div className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-1">GIẢI ĐẤU CỦA NĂM</div>
               <h3 className="text-xl font-bold text-white mb-1">Vietnam Pickleball Open 2025</h3>
               <p className="text-white/70 text-[13px] line-clamp-2">Giải đấu quy mô nhất khu vực Đông Nam Á năm qua.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
