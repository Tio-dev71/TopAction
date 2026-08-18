"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Users, Heart, User } from "lucide-react";

export interface EventCardProps {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryColor?: string;
  image: string;
  date?: string;
  location?: string;
  coach?: string;
  price: string;
  status: string;
  statusColor?: string;
  participants?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
}

export function EventCard({ item }: { item: EventCardProps }) {
  // Determine badge color based on category if not explicitly provided
  const getCategoryColor = (category: string) => {
    if (category.toLowerCase().includes("chạy")) return "bg-[#22b39b]";
    if (category.toLowerCase().includes("pickleball")) return "bg-[#6c47ff]";
    if (category.toLowerCase().includes("sân")) return "bg-[#3b82f6]";
    if (category.toLowerCase().includes("lớp")) return "bg-[#1e3a8a]";
    return "bg-[#1d4ed8]";
  };

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes("đang mở") || status.toLowerCase().includes("còn trống")) 
      return "text-[#22b39b] bg-[#22b39b]/10 border-[#22b39b]/20";
    if (status.toLowerCase().includes("sắp diễn ra")) 
      return "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20";
    if (status.toLowerCase().includes("đóng")) 
      return "text-muted-foreground bg-secondary border-border";
    return "text-[#22b39b] bg-[#22b39b]/10 border-[#22b39b]/20";
  };

  const catColor = item.categoryColor || getCategoryColor(item.category);
  const statColor = item.statusColor || getStatusColor(item.status);

  return (
    <Link
      href={`/giai-dau/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-border/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-primary/20 h-full w-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        {item.category && (
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-sm ${catColor}`}>
              {item.category}
            </span>
          </div>
        )}

        {/* Special Badges (Featured, Hot, New) */}
        {(item.isFeatured || item.isHot || item.isNew) && (
          <div className="absolute top-3 left-3">
             {item.isFeatured && <span className="inline-flex items-center rounded-full bg-[#22b39b] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">Nổi bật</span>}
             {item.isHot && <span className="inline-flex items-center rounded-full bg-[#f97316] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">Hot</span>}
             {item.isNew && <span className="inline-flex items-center rounded-full bg-[#3b82f6] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">Mới</span>}
          </div>
        )}

        {/* Heart Icon */}
        <button className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[44px]">
          {item.title}
        </h3>

        <div className="mt-3 flex flex-col gap-1.5 text-[13px] text-muted-foreground flex-1">
          {item.date && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>{item.date}</span>
            </div>
          )}
          {item.coach && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0" />
              <span>HLV: <span className="font-semibold text-foreground">{item.coach}</span></span>
            </div>
          )}
          {item.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="mt-4 mb-3">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statColor}`}>
            {item.status}
          </span>
        </div>

        {/* Footer (Price & Participants) */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
          <span className="font-bold text-foreground text-[14px]">
            {item.price}
          </span>
          
          {item.participants !== undefined && (
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{item.participants.toLocaleString("vi-VN")} đã đăng ký</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
