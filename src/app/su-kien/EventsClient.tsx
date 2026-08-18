"use client";

import { useState } from "react";
import { Search, Plus, CalendarDays, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/cards/EventCard";
import { MainContainer } from "@/components/layout/MainContainer";
import { EventFilterSidebar } from "@/components/events/EventFilterSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "running", label: "Chạy bộ" },
  { id: "pickleball", label: "Pickleball" },
  { id: "football", label: "Bóng đá" },
  { id: "marathon", label: "Marathon" },
  { id: "cycling", label: "Đạp xe" },
  { id: "tennis", label: "Tennis" },
  { id: "badminton", label: "Cầu lông" },
  { id: "yoga", label: "Yoga" },
  { id: "other", label: "Khác" },
];

const EVENTS = [
  {
    id: "evt-1",
    slug: "65-nam-chung-tay-xoa-diu-noi-dau-da-cam",
    title: "Sải bước nghĩa tình - 65 năm chung tay xoa dịu nỗi đau da cam",
    category: "Chạy bộ",
    categoryColor: "bg-[#22b39b]",
    image: "https://images.unsplash.com/photo-1552674605-15c21746360c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "20/09/2026",
    location: "Hồ Hoàn Kiếm, Hà Nội",
    price: "Từ 200.000đ",
    status: "Đang mở đăng ký",
    participants: 1256,
  },
  {
    id: "evt-2",
    slug: "top-pickleball-tour-2026",
    title: "TOP Pickleball Tour 2026",
    category: "Pickleball",
    categoryColor: "bg-[#6c47ff]",
    image: "https://images.unsplash.com/photo-1622227432807-91eb59a23d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "15-17/08/2026",
    location: "Nhà thi đấu Cầu Giấy, Hà Nội",
    price: "Từ 300.000đ",
    status: "Đang mở đăng ký",
    participants: 856,
  },
  {
    id: "evt-3",
    slug: "stadium-pickleball",
    title: "Giải Pickleball Hà Nội Open 2026",
    category: "Pickleball",
    categoryColor: "bg-[#3b82f6]",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "01/09/2026",
    location: "Sân Pickleball Long Biên, Hà Nội",
    price: "Từ 250.000đ",
    status: "Đang mở đăng ký",
    participants: 612,
  },
  {
    id: "evt-4",
    slug: "danang-marathon",
    title: "Danang Marathon 2026",
    category: "Marathon",
    categoryColor: "bg-[#0ea5e9]",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "11/01/2026",
    location: "TP. Đà Nẵng",
    price: "Từ 400.000đ",
    status: "Sắp diễn ra",
    participants: 2034,
  },
  {
    id: "evt-5",
    slug: "vietnam-cycling",
    title: "Vietnam Cycling Challenge 2026",
    category: "Đạp xe",
    categoryColor: "bg-[#f97316]",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "05/11/2026",
    location: "Hòa Bình",
    price: "Từ 150.000đ",
    status: "Đang mở đăng ký",
    participants: 450,
  },
  {
    id: "evt-6",
    slug: "giai-bong-da-doanh-nghiep",
    title: "Giải Bóng đá Doanh nghiệp 2026",
    category: "Bóng đá",
    categoryColor: "bg-[#10b981]",
    image: "https://images.unsplash.com/photo-1552674605-15c21746360c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "20/12/2026",
    location: "Sân Vận động Quốc gia Mỹ Đình",
    price: "Từ 5.000.000đ",
    status: "Sắp diễn ra",
  },
  {
    id: "evt-7",
    slug: "tennis-championship",
    title: "Giải Tennis Vô Địch Quốc Gia",
    category: "Tennis",
    categoryColor: "bg-[#3b82f6]",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "10/10/2026",
    location: "Sân Tennis Phú Thọ, TP. HCM",
    price: "Từ 500.000đ",
    status: "Đang mở đăng ký",
    participants: 120,
  },
  {
    id: "evt-8",
    slug: "yoga-retreat",
    title: "Khóa Tu Yoga & Thiền Định Kéo Dài 3 Ngày",
    category: "Yoga",
    categoryColor: "bg-[#a855f7]",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    date: "15/12/2026",
    location: "Đà Lạt, Lâm Đồng",
    price: "Từ 2.000.000đ",
    status: "Còn trống",
    participants: 45,
  }
];

import { VerifyInterceptorModal } from "@/components/modals/VerifyInterceptorModal";

export function EventsClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const filteredEvents = EVENTS.filter(event => 
    activeCategory === "all" || event.category === CATEGORIES.find(c => c.id === activeCategory)?.label
  );

  return (
    <>
      <Navbar />
      <div className="bg-[#f8fafc] min-h-screen pb-20 pt-8 sm:pt-12">
        <MainContainer>
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-3">Sự kiện</h1>
              <p className="text-[15px] text-muted-foreground max-w-xl leading-relaxed">
                Khám phá và tham gia các sự kiện thể thao, giải đấu và hoạt động cộng đồng
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-[320px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/60" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sự kiện, giải đấu, địa điểm..." 
                  className="w-full bg-white border border-border/80 rounded-xl h-11 pl-11 pr-4 text-[14px] shadow-sm transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button 
                onClick={() => setIsVerifyModalOpen(true)}
                className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-[14px] shadow-sm shadow-primary/20 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tạo sự kiện
              </Button>
            </div>
          </div>
          
          <VerifyInterceptorModal 
            isOpen={isVerifyModalOpen} 
            onClose={() => setIsVerifyModalOpen(false)} 
            requiredTier="organizer"
            title="Xác minh Đơn vị Tổ chức"
            description="Để tạo Giải đấu/Sự kiện và thu phí đăng ký, bạn cần nâng cấp lên tài khoản TopPlay Verified cấp Đơn vị Tổ chức và nạp Quỹ bảo vệ người dùng."
          />

          {/* Category Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-2 mb-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? "bg-[#1d4ed8] text-white shadow-sm" 
                    : "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {activeCategory === cat.id ? <CalendarDays className="h-4 w-4" /> : <Ticket className="h-4 w-4 opacity-70" />}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Sidebar */}
            <EventFilterSidebar />

            {/* Right Content */}
            <div className="flex-1 w-full min-w-0">
              {/* Sorting */}
              <div className="flex justify-end mb-6 items-center gap-3">
                <span className="text-[13px] font-medium text-muted-foreground">Sắp xếp:</span>
                <div className="relative">
                  <select className="h-9 bg-white border border-border/80 rounded-lg px-3 pr-8 text-[13px] font-semibold appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer shadow-sm">
                    <option>Mới nhất</option>
                    <option>Sắp diễn ra</option>
                    <option>Phổ biến nhất</option>
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              {/* Grid 4 columns on XL, 3 on LG, 2 on SM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} item={event} />
                ))}
                {filteredEvents.length === 0 && (
                  <div className="col-span-full py-20 text-center text-muted-foreground">
                    Không tìm thấy sự kiện nào trong danh mục này.
                  </div>
                )}
              </div>

              {/* Pagination / Load More */}
              {filteredEvents.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <Button variant="outline" className="h-11 px-8 rounded-xl border-border/80 font-bold hover:bg-secondary shadow-sm">
                    Xem thêm
                  </Button>
                </div>
              )}
            </div>
          </div>
        </MainContainer>
      </div>
      <Footer />
    </>
  );
}
