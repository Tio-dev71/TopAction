import { Metadata } from "next";
import { Search, PenLine, Image as ImageIcon, MessageSquare, ThumbsUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainContainer } from "@/components/layout/MainContainer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Cộng Đồng | TOPPLAY",
  description: "Cộng đồng thể thao lớn nhất Việt Nam",
};

const POSTS = [
  {
    id: "post-1",
    author: { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?u=1", role: "Vận động viên" },
    time: "2 giờ trước",
    content: "Vừa hoàn thành giải chạy Danang Marathon. Thời tiết tuyệt vời và cung đường rất đẹp! Cảm ơn BTC đã tạo ra một sự kiện đáng nhớ.",
    images: ["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    likes: 124,
    comments: 18,
  },
  {
    id: "post-2",
    author: { name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?u=2", role: "Huấn luyện viên" },
    time: "5 giờ trước",
    content: "Lớp Pickleball cơ bản tuần này sẽ tập trung vào kỹ thuật serve nhé mọi người. Hẹn gặp mọi người tại sân TopPlay Cầu Giấy lúc 18h thứ 6.",
    images: [],
    likes: 56,
    comments: 12,
  },
];

export default function CongDongPage() {
  return (
    <>
      <Navbar />
      <div className="bg-[#f0f2f5] min-h-screen pb-20 pt-8 sm:pt-12">
      <MainContainer>
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-3">Cộng Đồng</h1>
            <p className="text-[15px] text-muted-foreground max-w-xl leading-relaxed">
              Kết nối, chia sẻ đam mê và học hỏi từ hàng ngàn vận động viên trên toàn quốc.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/60" />
              <input 
                type="text" 
                placeholder="Tìm kiếm bài viết, người dùng..." 
                className="w-full bg-white border border-border/80 rounded-xl h-11 pl-11 pr-4 text-[14px] shadow-sm transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Sidebar - Shortcuts */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            <div className="bg-white rounded-[16px] shadow-sm border border-border/40 p-3">
              <nav className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary text-foreground font-semibold text-[14px]">
                  <div className="w-8 h-8 rounded-full bg-[#1d4ed8]/10 text-[#1d4ed8] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                  </div>
                  Bảng tin
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary/50 font-medium text-[14px] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  Nhóm của bạn
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary/50 font-medium text-[14px] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                  </div>
                  Sự kiện đã tham gia
                </a>
              </nav>
            </div>
          </div>

          {/* Center Content - Feed */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            
            {/* Create Post */}
            <div className="bg-white rounded-[16px] shadow-sm border border-border/40 p-4">
              <div className="flex gap-3 mb-3">
                <img src="https://i.pravatar.cc/150?u=current" alt="Avatar" className="w-10 h-10 rounded-full border border-border/50" />
                <button className="flex-1 bg-secondary hover:bg-secondary/80 rounded-full px-4 text-left text-[14px] text-muted-foreground transition-colors h-10">
                  Bạn đang nghĩ gì?
                </button>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="text-muted-foreground font-medium rounded-lg hover:bg-secondary">
                    <ImageIcon className="h-4 w-4 mr-2 text-green-500" />
                    Ảnh/Video
                  </Button>
                </div>
                <Button size="sm" className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg px-4 font-bold">
                  Đăng
                </Button>
              </div>
            </div>

            {/* Posts */}
            {POSTS.map((post) => (
              <div key={post.id} className="bg-white rounded-[16px] shadow-sm border border-border/40 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border border-border/50" />
                    <div>
                      <h4 className="font-bold text-[15px] text-foreground leading-none">{post.author.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-[12px] text-muted-foreground">
                        <span>{post.time}</span>
                        <span>•</span>
                        <span>{post.author.role}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-wrap mb-3">
                    {post.content}
                  </p>
                </div>
                
                {post.images.length > 0 && (
                  <div className="w-full">
                    <img src={post.images[0]} alt="Post media" className="w-full max-h-[500px] object-cover" />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center justify-between text-[13px] text-muted-foreground mb-3 pb-3 border-b border-border/40">
                    <span>{post.likes} lượt thích</span>
                    <span>{post.comments} bình luận</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary font-semibold text-[14px] transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      Thích
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary font-semibold text-[14px] transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      Bình luận
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary font-semibold text-[14px] transition-colors">
                      <Share2 className="h-4 w-4" />
                      Chia sẻ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar - Trending */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
             <div className="bg-white rounded-[16px] shadow-sm border border-border/40 p-4">
               <h3 className="font-bold text-[15px] text-foreground mb-4">Chủ đề nổi bật</h3>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex flex-col gap-1 cursor-pointer group">
                     <span className="text-[13px] text-muted-foreground font-medium">#PickleballVietnam</span>
                     <span className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
                       Kỹ thuật serve xoáy cơ bản
                     </span>
                     <span className="text-[12px] text-muted-foreground">1,234 bài viết</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </MainContainer>
    </div>
    <Footer />
    </>
  );
}
