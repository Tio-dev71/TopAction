import { Clock, MessageSquare } from "lucide-react";
import Link from "next/link";

export function LatestNewsList() {
  const news = [
    {
      title: "Luật Pickleball 2026: Những thay đổi quan trọng người chơi cần biết",
      excerpt: "Liên đoàn Pickleball Quốc tế vừa công bố bộ luật cập nhật áp dụng từ tháng 1/2026. Một số điều chỉnh về giao bóng và khu vực non-volley zone sẽ ảnh hưởng trực tiếp đến chiến thuật thi đấu.",
      image: "1552674605-15c21746360c",
      cat: "KIẾN THỨC",
      color: "bg-yellow-500 text-yellow-950",
      time: "10 giờ trước",
      comments: 42
    },
    {
      title: "Garmin ra mắt dòng đồng hồ Forerunner 975 chuyên biệt cho chạy bộ đường mòn",
      excerpt: "Bản nâng cấp mang đến thời lượng pin lên đến 120 giờ liên tục ở chế độ GPS và tính năng theo dõi sức mạnh cơ bắp theo thời gian thực.",
      image: "1579952363873-27f3bade9f55",
      cat: "CHẠY BỘ",
      color: "bg-[#0ea5e9] text-white",
      time: "12 giờ trước",
      comments: 18
    },
    {
      title: "Cộng đồng Tennis TP.HCM chung tay ủng hộ trẻ em nghèo",
      excerpt: "Hơn 500 thành viên từ các CLB Tennis khu vực phía Nam đã tổ chức giải đấu từ thiện, gây quỹ được hơn 2 tỷ đồng xây trường học.",
      image: "1622227432807-91eb59a23d9b", // fallback generic
      cat: "ĐỜI SỐNG",
      color: "bg-purple-600 text-white",
      time: "1 ngày trước",
      comments: 5
    },
    {
      title: "Hướng dẫn chọn giày Pickleball đúng cách để tránh chấn thương",
      excerpt: "Nhiều người chơi vẫn sử dụng giày chạy bộ cho môn Pickleball dẫn đến lật sơ mi. Chuyên gia phân tích cấu tạo giày phù hợp cho môn thể thao di chuyển ngang nhiều.",
      image: "1554068865-24cecd4e34b8",
      cat: "KIẾN THỨC",
      color: "bg-yellow-500 text-yellow-950",
      time: "1 ngày trước",
      comments: 89
    },
    {
      title: "Khai mạc giải Futsal Sinh viên Toàn quốc 2026",
      excerpt: "Lễ khai mạc diễn ra hoành tráng tại Nhà thi đấu Quân khu 7 với sự tham dự của 32 đội bóng sinh viên xuất sắc nhất đến từ 3 miền.",
      image: "1599566150163-29194dcaad36",
      cat: "BÓNG ĐÁ",
      color: "bg-emerald-600 text-white",
      time: "2 ngày trước",
      comments: 24
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-6">
         <h2 className="text-2xl font-black text-foreground">Tin Mới Nhất</h2>
      </div>

      <div className="flex flex-col gap-8">
        {news.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-6 group">
            <Link href={`/tin-tuc/post-${idx}`} className="sm:w-[280px] shrink-0 overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[4/3] relative">
              <img 
                src={`https://images.unsplash.com/photo-${item.image}?auto=format&fit=crop&w=600&q=80`} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </Link>
            
            <div className="flex flex-col justify-center py-1">
              <div className="flex items-center gap-3 mb-3">
                 <span className={`${item.color} text-[11px] font-bold px-2 py-0.5 rounded-md`}>
                   {item.cat}
                 </span>
                 <span className="flex items-center gap-1.5 text-muted-foreground text-[12px] font-medium">
                   <Clock className="w-3.5 h-3.5" /> {item.time}
                 </span>
              </div>
              
              <Link href={`/tin-tuc/post-${idx}`}>
                <h3 className="text-[20px] font-bold text-foreground mb-3 leading-snug group-hover:text-[#1d4ed8] transition-colors">
                  {item.title}
                </h3>
              </Link>
              
              <p className="text-muted-foreground text-[14px] leading-relaxed line-clamp-2 mb-4">
                {item.excerpt}
              </p>
              
              <div className="flex items-center gap-4 text-muted-foreground text-[13px] font-medium mt-auto">
                 <span className="flex items-center gap-1.5 hover:text-[#1d4ed8] transition-colors cursor-pointer">
                   <MessageSquare className="w-4 h-4" /> {item.comments} Bình luận
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full py-4 mt-8 rounded-xl border border-border/80 text-foreground font-bold hover:bg-secondary transition-colors text-[14px]">
        Xem thêm tin tức
      </button>
    </div>
  );
}
