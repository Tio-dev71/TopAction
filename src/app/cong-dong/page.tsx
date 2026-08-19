import { Metadata } from "next";
import { Search } from "lucide-react";
import { MainContainer } from "@/components/layout/MainContainer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import CreatePostBox from "./CreatePostBox";
import PostItem from "./PostItem";
import { getPosts } from "./actions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Cộng Đồng | TOPPLAY",
  description: "Cộng đồng thể thao lớn nhất Việt Nam",
};

export const revalidate = 0; // Luôn fetch dữ liệu mới nhất (hoặc sử dụng router.refresh)

export default async function CongDongPage() {
  const posts = await getPosts();
  
  // Get current user avatar
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  let avatarUrl = "";
  if (session?.user?.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", session.user.id)
      .single();
    if (profile?.avatar_url) {
      avatarUrl = profile.avatar_url;
    }
  }

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
            <div className="hidden lg:block lg:col-span-1 space-y-4 sticky top-24">
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
            <div className="col-span-1 lg:col-span-3 space-y-6">
              <CreatePostBox avatarUrl={avatarUrl} />

              {/* Danh sách bài viết */}
              {posts.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-border/40 text-muted-foreground">
                  Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
                </div>
              ) : (
                posts.map((post) => (
                  <PostItem key={post.id} post={post} />
                ))
              )}
            </div>

          </div>
        </MainContainer>
      </div>
      <Footer />
    </>
  );
}
