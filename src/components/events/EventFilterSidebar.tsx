"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EventFilterSidebar() {
  const [price, setPrice] = useState(0);

  return (
    <div className="w-full lg:w-[280px] shrink-0 bg-white rounded-2xl shadow-sm border border-border/60 p-5 hidden lg:block h-max sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-foreground">Bộ lọc tìm kiếm</h3>
        <button className="flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">
          <RefreshCw className="h-3.5 w-3.5" />
          Đặt lại
        </button>
      </div>

      <div className="space-y-6">
        {/* Địa điểm */}
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-foreground">Địa điểm</label>
          <div className="relative">
            <select className="w-full h-10 bg-background border border-border/80 rounded-xl px-3 text-[14px] appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer">
              <option>Chọn địa điểm</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
              <option>Hải Phòng</option>
              <option>Cần Thơ</option>
              <option>Bình Dương</option>
              <option>Đồng Nai</option>
              <option>Quảng Ninh</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
          </div>
        </div>

        {/* Thời gian */}
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-foreground">Thời gian</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input type="text" placeholder="Từ ngày" className="w-full h-10 bg-background border border-border/80 rounded-xl pl-3 pr-8 text-[13px] focus:outline-none focus:border-primary" />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
            </div>
            <div className="relative">
              <input type="text" placeholder="Đến ngày" className="w-full h-10 bg-background border border-border/80 rounded-xl pl-3 pr-8 text-[13px] focus:outline-none focus:border-primary" />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loại sự kiện */}
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-foreground">Loại sự kiện</label>
          <div className="relative">
            <select className="w-full h-10 bg-background border border-border/80 rounded-xl px-3 text-[14px] appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer">
              <option>Chọn loại sự kiện</option>
              <option>Chạy bộ</option>
              <option>Pickleball</option>
              <option>Bóng đá</option>
              <option>Đạp xe</option>
              <option>Tennis</option>
              <option>Cầu lông</option>
              <option>Bơi lội</option>
              <option>Bóng chuyền</option>
              <option>Bóng rổ</option>
              <option>Bóng bàn</option>
              <option>Yoga</option>
              <option>Khác</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        {/* Khoảng giá */}
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-foreground">Khoảng giá (VNĐ)</label>
          <div className="pt-2">
            <input 
              type="range" 
              min="0" 
              max="10000000" 
              step="100000" 
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              style={{
                background: `linear-gradient(to right, #1d4ed8 ${(price / 10000000) * 100}%, #f1f5f9 ${(price / 10000000) * 100}%)`
              }}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#1d4ed8]" 
            />
            <div className="flex justify-between mt-2 text-[12px] font-medium text-foreground">
              <span className="text-primary font-bold">{price === 0 ? "0đ" : new Intl.NumberFormat('vi-VN').format(price) + 'đ'}</span>
              <span>10.000.000+</span>
            </div>
          </div>
        </div>

        {/* Trạng thái */}
        <div className="space-y-3 pt-2">
          <label className="text-[13px] font-semibold text-foreground">Trạng thái</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border/80 text-primary focus:ring-primary accent-primary" />
              <span className="text-[14px] text-foreground font-medium">Đang mở đăng ký</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-border/80 text-primary focus:ring-primary accent-primary" />
              <span className="text-[14px] text-foreground font-medium">Sắp diễn ra</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-border/80 text-primary focus:ring-primary accent-primary" />
              <span className="text-[14px] text-foreground font-medium">Đã diễn ra</span>
            </label>
          </div>
        </div>

        {/* Action */}
        <div className="pt-4">
          <Button className="w-full h-11 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-[14px] shadow-sm shadow-primary/20">
            Áp dụng bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
}
