import { Mail, CalendarDays, TrendingUp, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NewsSidebar() {
  return (
    <div className="flex flex-col gap-10">
      {/* Most Viewed */}
      <div>
        <div className="flex items-center gap-2 border-b-2 border-foreground pb-3 mb-6">
           <TrendingUp className="w-5 h-5 text-[#1d4ed8]" />
           <h3 className="text-[18px] font-black text-foreground">Tin đọc nhiều</h3>
        </div>
        
        <div className="flex flex-col gap-5">
          {[
            "Vợt Pickleball sợi Carbon và Sợi thủy tinh: Nên chọn loại nào cho người mới?",
            "Lịch thi đấu chính thức Giải Vô địch Quốc gia Pickleball 2026",
            "Hướng dẫn kỹ thuật Dinking cơ bản cho người mới tập chơi",
            "Top 5 chấn thương thường gặp khi chơi Pickleball và cách phòng tránh",
            "Đánh giá chi tiết Vợt JOOLA Ben Johns Perseus CFS 16"
          ].map((title, idx) => (
            <Link href={`/tin-tuc/post-${idx}`} key={idx} className="flex gap-4 group">
              <span className={`text-3xl font-black italic mt-1 ${idx < 3 ? 'text-[#1d4ed8]' : 'text-muted-foreground/30'}`}>
                0{idx + 1}
              </span>
              <h4 className="text-[14px] font-bold text-foreground leading-snug group-hover:text-[#1d4ed8] transition-colors">
                {title}
              </h4>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-[#0A1A3B] rounded-2xl p-6 text-white text-center shadow-lg shadow-[#0A1A3B]/10">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-yellow-400" />
        </div>
        <h3 className="text-[18px] font-bold mb-2">Đăng ký nhận tin</h3>
        <p className="text-[13px] text-white/70 mb-6">Nhận thông báo sớm nhất về các giải đấu, tin tức và ưu đãi từ TopPlay.</p>
        
        <div className="flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="Email của bạn..." 
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400"
          />
          <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold h-11 rounded-xl">
            Đăng ký ngay
          </Button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center gap-2 border-b-2 border-foreground pb-3 mb-6">
           <CalendarDays className="w-5 h-5 text-[#1d4ed8]" />
           <h3 className="text-[18px] font-black text-foreground">Sự kiện sắp tới</h3>
        </div>
        
        <div className="flex flex-col gap-4">
          {[
            { date: "15", month: "08", title: "Giải Pickleball Vô địch Quốc gia", loc: "Hà Nội" },
            { date: "22", month: "08", title: "Danang International Marathon", loc: "Đà Nẵng" },
            { date: "05", month: "09", title: "Giải Vô địch Cầu lông Cá nhân", loc: "TP.HCM" },
          ].map((ev, idx) => (
            <div key={idx} className="flex gap-4 items-center bg-white border border-border/60 rounded-xl p-3 hover:border-[#1d4ed8]/30 transition-colors cursor-pointer">
              <div className="bg-[#f8fafc] border border-border/80 rounded-lg w-14 h-14 flex flex-col items-center justify-center shrink-0">
                 <span className="text-[18px] font-black text-[#1d4ed8] leading-none">{ev.date}</span>
                 <span className="text-[11px] font-bold text-muted-foreground uppercase">Th{ev.month}</span>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-foreground leading-tight mb-1 line-clamp-1">{ev.title}</h4>
                <p className="text-[12px] text-muted-foreground">{ev.loc}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-[13px] font-bold text-[#1d4ed8] hover:underline text-left">
          Xem lịch sự kiện &rarr;
        </button>
      </div>

      {/* Popular Tags */}
      <div>
        <div className="flex items-center gap-2 border-b-2 border-foreground pb-3 mb-6">
           <Tag className="w-5 h-5 text-[#1d4ed8]" />
           <h3 className="text-[18px] font-black text-foreground">Chủ đề quan tâm</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {["Vợt Pickleball", "Kỹ thuật Dinking", "Chấn thương thể thao", "Sân Pickleball Hà Nội", "Luật chơi", "Marathon", "Khởi động", "Dinh dưỡng"].map((tag) => (
            <button key={tag} className="bg-secondary/50 hover:bg-secondary border border-border/60 text-foreground text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors">
              #{tag}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
