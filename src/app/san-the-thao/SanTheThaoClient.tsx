"use client";

import { useState } from "react";
import { Search, Plus, MapPin, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/cards/EventCard";
import { MainContainer } from "@/components/layout/MainContainer";
import { EventFilterSidebar } from "@/components/events/EventFilterSidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "football", label: "Sân Bóng đá" },
  { id: "badminton", label: "Sân Cầu lông" },
  { id: "tennis", label: "Sân Tennis" },
  { id: "pickleball", label: "Sân Pickleball" },
  { id: "basketball", label: "Sân Bóng rổ" },
  { id: "volleyball", label: "Sân Bóng chuyền" },
];

const EVENTS = [
  {
    id: "stt-1",
    slug: "stadium-pickleball",
    title: "Sân Pickleball: Stadium Pickleball",
    category: "Sân Pickleball",
    categoryColor: "bg-[#3b82f6]",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Quận 7, TP. Hồ Chí Minh",
    price: "200.000đ/giờ",
    status: "Còn trống",
  },
  {
    id: "stt-2",
    slug: "san-bong-da-mini",
    title: "Sân Bóng đá Mini Mỹ Đình",
    category: "Sân Bóng đá",
    categoryColor: "bg-[#10b981]",
    image: "https://images.unsplash.com/photo-1518605368461-1ee51a66699a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Nam Từ Liêm, Hà Nội",
    price: "350.000đ/giờ",
    status: "Còn trống",
  },
  {
    id: "stt-3",
    slug: "san-cau-long-tieu-chuan",
    title: "Sân Cầu lông Tiêu chuẩn Quốc gia",
    category: "Sân Cầu lông",
    categoryColor: "bg-[#eab308]",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Cầu Giấy, Hà Nội",
    price: "150.000đ/giờ",
    status: "Đang mở đặt sân",
  },
  {
    id: "stt-4",
    slug: "san-tennis-phu-tho",
    title: "Sân Tennis Phú Thọ",
    category: "Sân Tennis",
    categoryColor: "bg-[#3b82f6]",
    image: "https://images.unsplash.com/photo-1622227432807-91eb59a23d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Quận 11, TP. HCM",
    price: "250.000đ/giờ",
    status: "Đang mở đặt sân",
  },
  {
    id: "stt-5",
    slug: "san-bong-ro-bach-khoa",
    title: "Sân Bóng rổ ĐH Bách Khoa",
    category: "Sân Bóng rổ",
    categoryColor: "bg-[#f97316]",
    image: "https://images.unsplash.com/photo-1519315901367-f34f815b6719?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Hai Bà Trưng, Hà Nội",
    price: "100.000đ/giờ",
    status: "Còn trống",
  },
  {
    id: "stt-6",
    slug: "san-bong-chuyen-nvh-thanh-nien",
    title: "Sân Bóng chuyền NVH Thanh Niên",
    category: "Sân Bóng chuyền",
    categoryColor: "bg-[#8b5cf6]",
    image: "https://images.unsplash.com/photo-1552674605-15c21746360c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    location: "Quận 1, TP. HCM",
    price: "150.000đ/giờ",
    status: "Kín lịch",
  }
];

export function SanTheThaoClient() {
  const [activeCategory, setActiveCategory] = useState("all");

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
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-3">Sân Thể Thao</h1>
              <p className="text-[15px] text-muted-foreground max-w-xl leading-relaxed">
                Tìm kiếm, xem đánh giá và đặt sân thể thao với giá ưu đãi tốt nhất ngay hôm nay.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-[320px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/60" />
                <input 
                  type="text" 
                  placeholder="Tìm sân thể thao theo tên, khu vực..." 
                  className="w-full bg-white border border-border/80 rounded-xl h-11 pl-11 pr-4 text-[14px] shadow-sm transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-[14px] shadow-sm shadow-primary/20 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Đăng sân
              </Button>
            </div>
          </div>

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
                {activeCategory === cat.id ? <Map className="h-4 w-4" /> : <MapPin className="h-4 w-4 opacity-70" />}
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
                    <option>Đánh giá cao nhất</option>
                    <option>Giá từ thấp tới cao</option>
                    <option>Gần bạn nhất</option>
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
                    Không tìm thấy sân thể thao nào trong danh mục này.
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
