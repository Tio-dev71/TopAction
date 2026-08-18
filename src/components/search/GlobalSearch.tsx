"use client";

import { useState } from "react";
import { Search, LayoutGrid, Ticket, Trophy, CalendarDays, GraduationCap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "all", label: "Tất cả", icon: LayoutGrid },
  { id: "venues", label: "Sân thể thao", icon: Ticket },
  { id: "tournaments", label: "Giải đấu", icon: Trophy },
  { id: "events", label: "Sự kiện", icon: CalendarDays },
  { id: "classes", label: "Lớp học / HLV", icon: GraduationCap },
];

const SUGGESTIONS = [
  "Sân Pickleball gần đây",
  "Giải Pickleball tháng 8",
  "Lớp học Pickleball",
  "Giải chạy cuối tuần",
  "Sân cầu lông",
];

export function GlobalSearch() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-24 z-20">
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-border/40">
        
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Tìm kiếm nhanh</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5">
            Tìm sân, giải đấu, lớp học hoặc sự kiện thể thao phù hợp với bạn
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex w-full bg-secondary/40 p-1.5 rounded-2xl gap-1 mb-5 overflow-x-auto no-scrollbar border border-border/50">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl py-3 px-4 text-[14.5px] font-semibold transition-all duration-200 ${
                  isActive 
                    ? "bg-white text-primary shadow-sm ring-1 ring-border/50" 
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-[22px] w-[22px] text-muted-foreground/60" />
          <input 
            type="text" 
            placeholder="Bạn muốn tìm gì? (sân, tên giải đấu, sự kiện...)" 
            className="w-full bg-white border border-border/80 rounded-2xl py-4 pl-14 pr-4 text-base transition-all hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="relative">
            <label className="absolute top-2 left-4 text-[11px] font-medium text-muted-foreground">Địa điểm</label>
            <select className="w-full h-14 bg-white border border-border/80 rounded-xl pt-4 pb-1 pl-3 pr-8 text-[14px] font-semibold appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-foreground">
              <option>Tất cả địa điểm</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <label className="absolute top-2 left-4 text-[11px] font-medium text-muted-foreground">Ngày</label>
            <select className="w-full h-14 bg-white border border-border/80 rounded-xl pt-4 pb-1 pl-3 pr-8 text-[14px] font-semibold appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-foreground">
              <option>Chọn ngày</option>
              <option>Hôm nay</option>
              <option>Ngày mai</option>
              <option>Cuối tuần này</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <label className="absolute top-2 left-4 text-[11px] font-medium text-muted-foreground">Thời gian</label>
            <select className="w-full h-14 bg-white border border-border/80 rounded-xl pt-4 pb-1 pl-3 pr-8 text-[14px] font-semibold appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-foreground">
              <option>Chọn thời gian</option>
              <option>Sáng (06:00 - 12:00)</option>
              <option>Chiều (12:00 - 18:00)</option>
              <option>Tối (18:00 - 24:00)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <label className="absolute top-2 left-4 text-[11px] font-medium text-muted-foreground">Môn thể thao</label>
            <select className="w-full h-14 bg-white border border-border/80 rounded-xl pt-4 pb-1 pl-3 pr-8 text-[14px] font-semibold appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-foreground">
              <option>Tất cả môn</option>
              <option>Pickleball</option>
              <option>Chạy bộ</option>
              <option>Bóng đá</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <label className="absolute top-2 left-4 text-[11px] font-medium text-muted-foreground">Khoảng giá</label>
            <select className="w-full h-14 bg-white border border-border/80 rounded-xl pt-4 pb-1 pl-3 pr-8 text-[14px] font-semibold appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-foreground">
              <option>Tất cả</option>
              <option>Dưới 200k</option>
              <option>200k - 500k</option>
              <option>Trên 500k</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          <Button className="h-14 w-full rounded-xl text-base font-bold bg-[#1d4ed8] shadow-md shadow-primary/20">
            Tìm kiếm
          </Button>
        </div>

        {/* Suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[13px] font-bold whitespace-nowrap mr-1 text-foreground">Gợi ý tìm kiếm:</span>
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              className="whitespace-nowrap rounded-full bg-secondary/60 px-4 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground border border-border/50"
            >
              {suggestion}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
