import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MainContainer } from "@/components/layout/MainContainer";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { Clock, MessageSquare, Share2, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chi tiết bài viết | TOPPLAY",
  description: "Chi tiết bài viết tin tức thể thao",
};

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pb-16 pt-8">
        <MainContainer>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
             <Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
             <ChevronRight className="w-3.5 h-3.5" />
             <Link href="/tin-tuc" className="hover:text-foreground transition-colors">Tin tức</Link>
             <ChevronRight className="w-3.5 h-3.5" />
             <Link href="/tin-tuc?cat=pickleball" className="hover:text-foreground transition-colors">Pickleball</Link>
             <ChevronRight className="w-3.5 h-3.5" />
             <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-[400px]">
               Giải Vô địch Quốc gia Pickleball 2026 chính thức khởi tranh
             </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left 70%: Article Content */}
            <div className="flex-1 lg:w-2/3 lg:max-w-[800px]">
               <div className="mb-6">
                 <span className="bg-[#1d4ed8] text-white text-[11px] font-bold px-3 py-1 rounded-md mb-4 inline-block">
                   PICKLEBALL
                 </span>
                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6 leading-[1.15] tracking-tight">
                   Giải Vô địch Quốc gia Pickleball 2026 chính thức khởi tranh với 2.000 VĐV
                 </h1>
                 
                 <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/60 mb-8">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" alt="Author" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-foreground">Nguyễn Tuấn Khang</div>
                        <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-medium">
                           <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 24/08/2026</span>
                           <span>•</span>
                           <span>5 phút đọc</span>
                        </div>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 text-muted-foreground">
                      <button className="flex items-center gap-1.5 text-[13px] font-medium hover:text-[#1d4ed8] transition-colors bg-secondary/50 px-3 py-1.5 rounded-full">
                        <Eye className="w-4 h-4" /> 12.5k
                      </button>
                      <button className="flex items-center gap-1.5 text-[13px] font-medium hover:text-[#1d4ed8] transition-colors bg-secondary/50 px-3 py-1.5 rounded-full">
                        <MessageSquare className="w-4 h-4" /> 148
                      </button>
                      <button className="flex items-center gap-1.5 text-[13px] font-medium hover:text-[#1d4ed8] transition-colors bg-secondary/50 px-3 py-1.5 rounded-full">
                        <Share2 className="w-4 h-4" /> Chia sẻ
                      </button>
                   </div>
                 </div>
               </div>

               {/* Highlights/Summary */}
               <div className="bg-[#f8fafc] border-l-4 border-[#1d4ed8] p-6 rounded-r-xl mb-8">
                 <h3 className="font-bold text-foreground mb-2">Tóm tắt nội dung:</h3>
                 <ul className="list-disc list-inside text-[15px] text-muted-foreground leading-relaxed space-y-1">
                   <li>Giải Vô địch Quốc gia Pickleball 2026 diễn ra từ 25/08 đến 30/08 tại Hà Nội.</li>
                   <li>Quy tụ hơn 2.000 vận động viên từ 45 tỉnh thành phố trên cả nước.</li>
                   <li>Tổng giải thưởng lên đến 1,5 tỷ đồng - lớn nhất từ trước đến nay.</li>
                 </ul>
               </div>

               {/* Hero Image */}
               <figure className="mb-10">
                 <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-secondary">
                   <img src="https://images.unsplash.com/photo-1622227432807-91eb59a23d9b?auto=format&fit=crop&w=1200&q=80" alt="Pickleball event" className="w-full h-full object-cover" />
                 </div>
                 <figcaption className="text-[13px] text-muted-foreground text-center mt-3 italic">
                   Lễ khai mạc Giải Vô địch Quốc gia Pickleball 2026 tại Cung điền kinh trong nhà (Ảnh: TopPlay)
                 </figcaption>
               </figure>

               {/* Content Body */}
               <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-[#1d4ed8] prose-img:rounded-2xl">
                 <p>
                   Sáng ngày 25/08, <strong>Giải Vô địch Quốc gia Pickleball 2026</strong> đã chính thức khai mạc tại Cung điền kinh trong nhà Hà Nội. Đây là giải đấu quy mô nhất từ trước đến nay do Liên đoàn Pickleball Việt Nam phối hợp cùng nền tảng TopPlay tổ chức.
                 </p>
                 
                 <h2>Sự kiện bước ngoặt của phong trào Pickleball Việt Nam</h2>
                 <p>
                   Phát biểu tại lễ khai mạc, đại diện Ban tổ chức cho biết: "Với hơn 2.000 vận động viên đăng ký tham gia thi đấu ở 12 nội dung từ phong trào đến chuyên nghiệp, giải đấu năm nay đánh dấu một bước phát triển vượt bậc của phong trào Pickleball tại Việt Nam. Không chỉ vượt kỷ lục về số lượng VĐV, chất lượng chuyên môn cũng được nâng tầm rõ rệt".
                 </p>
                 
                 <p>
                   Giải đấu quy tụ hàng loạt tay vợt hàng đầu quốc gia và các vận động viên quốc tế thi đấu dưới màu áo các Câu lạc bộ trong nước. Hệ thống 30 sân thi đấu đạt chuẩn quốc tế đã được lắp đặt hoàn thiện để phục vụ hàng trăm trận đấu diễn ra liên tục trong 5 ngày.
                 </p>

                 <h2>TopPlay đồng hành ứng dụng công nghệ vào quản lý giải đấu</h2>
                 <p>
                   Một điểm nhấn của giải năm nay là việc áp dụng toàn diện hệ thống công nghệ quản lý giải đấu của TopPlay. Toàn bộ lịch thi đấu, kết quả cập nhật theo thời gian thực (Live Scoring), nhánh đấu và thống kê chi tiết đều được công khai trực tiếp trên nền tảng TopPlay.vn.
                 </p>
                 
                 <p>
                   Người hâm mộ có thể dễ dàng theo dõi trực tiếp kết quả của các tay vợt yêu thích, xem xếp hạng và nhận thông báo ngay khi trận đấu bắt đầu thông qua ứng dụng di động.
                 </p>
               </div>

               {/* Tags */}
               <div className="flex flex-wrap items-center gap-2 mt-12 pt-6 border-t border-border/60">
                 <span className="text-[14px] font-bold text-foreground mr-2">Tags:</span>
                 {["Pickleball", "Giải Vô địch Quốc gia", "TopPlay", "Hà Nội", "Sự kiện"].map(tag => (
                   <Link href={`/tin-tuc/tag/${tag}`} key={tag} className="bg-secondary/50 hover:bg-secondary text-foreground text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors">
                     #{tag}
                   </Link>
                 ))}
               </div>
            </div>

            {/* Right 30%: Sidebar */}
            <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0">
               <div className="sticky top-[100px]">
                 <NewsSidebar />
               </div>
            </div>
            
          </div>
        </MainContainer>
      </main>

      <Footer />
    </div>
  );
}
