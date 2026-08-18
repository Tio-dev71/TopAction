import { Clock, MessageSquare } from "lucide-react";
import Link from "next/link";

export function FeaturedNews() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-12">
      {/* Left Large Feature */}
      <Link href="/tin-tuc/giai-vo-dich-quoc-gia-pickleball-2026" className="relative group overflow-hidden rounded-[24px] lg:w-2/3 h-[400px] lg:h-[500px]">
        <img 
          src="https://images.unsplash.com/photo-1622227432807-91eb59a23d9b?auto=format&fit=crop&w=1200&q=80" 
          alt="Featured news" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A3B]/90 via-[#0A1A3B]/40 to-transparent"></div>
        <div className="absolute inset-0 p-6 lg:p-10 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-[#1d4ed8] text-white text-[12px] font-bold px-3 py-1 rounded-md">PICKLEBALL</span>
             <span className="flex items-center gap-1.5 text-white/80 text-[13px] font-medium"><Clock className="w-3.5 h-3.5" /> 2 giờ trước</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-extrabold text-white mb-4 leading-tight group-hover:text-yellow-400 transition-colors">
            Giải Vô địch Quốc gia Pickleball 2026 chính thức khởi tranh với 2.000 VĐV
          </h2>
          <p className="text-white/80 text-[15px] max-w-2xl line-clamp-2 mb-4">
            Sự kiện lớn nhất năm của bộ môn Pickleball tại Việt Nam đã quy tụ hàng ngàn vận động viên chuyên nghiệp và phong trào, hứa hẹn mang đến những trận cầu đỉnh cao.
          </p>
          <div className="flex items-center gap-4 text-white/60 text-[13px] font-medium">
             <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> 148 Bình luận</span>
          </div>
        </div>
      </Link>

      {/* Right Stacked Features */}
      <div className="flex flex-col gap-4 lg:w-1/3">
        <Link href="/tin-tuc/dinh-duong-the-thao" className="relative group overflow-hidden rounded-[24px] flex-1 h-[200px] lg:h-auto">
          <img 
            src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80" 
            alt="Feature 2" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A3B]/90 to-transparent"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <span className="bg-yellow-500 text-yellow-950 text-[11px] font-bold px-2.5 py-0.5 rounded-md w-fit mb-3">KIẾN THỨC</span>
            <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">Dinh dưỡng chuẩn bị cho giải đấu Marathon: Ăn gì trước giờ G?</h3>
            <span className="flex items-center gap-1.5 text-white/60 text-[12px] font-medium"><Clock className="w-3 h-3" /> 5 giờ trước</span>
          </div>
        </Link>
        
        <Link href="/tin-tuc/san-co-nhan-tao" className="relative group overflow-hidden rounded-[24px] flex-1 h-[200px] lg:h-auto">
          <img 
            src="https://images.unsplash.com/photo-1552674605-15c21746360c?auto=format&fit=crop&w=600&q=80" 
            alt="Feature 3" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A3B]/90 to-transparent"></div>
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md w-fit mb-3">BÓNG ĐÁ</span>
            <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">Đánh giá 10 sân cỏ nhân tạo đạt chuẩn FIFA tại TP.HCM</h3>
            <span className="flex items-center gap-1.5 text-white/60 text-[12px] font-medium"><Clock className="w-3 h-3" /> 1 ngày trước</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
