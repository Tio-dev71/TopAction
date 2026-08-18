"use client";

import { useState } from "react";
import { ChevronDown, Search, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClubCard } from "@/components/cards/ClubCard";
import { MainContainer } from "@/components/layout/MainContainer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CLUBS = [
  {
    id: "club-1",
    slug: "pickleball-ha-noi-club",
    name: "Pickleball Hà Nội Club",
    sport: "Pickleball",
    members: 1250,
    logo: "https://images.unsplash.com/photo-1622227432807-91eb59a23d9b?auto=format&fit=crop&w=150&q=80",
    location: "Hà Nội",
  },
  {
    id: "club-2",
    slug: "viet-runners-hn",
    name: "VietRunners HN",
    sport: "Chạy bộ",
    members: 8560,
    logo: "https://images.unsplash.com/photo-1552674605-15c21746360c?auto=format&fit=crop&w=150&q=80",
    location: "Hà Nội",
  },
  {
    id: "club-3",
    slug: "cau-long-sinh-vien",
    name: "Cầu Lông Sinh Viên",
    sport: "Cầu lông",
    members: 3200,
    logo: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=150&q=80",
    location: "TP. Hồ Chí Minh",
  },
  {
    id: "club-4",
    slug: "fc-da-bong-cuoi-tuan",
    name: "FC Đá Bóng Cuối Tuần",
    sport: "Bóng đá",
    members: 450,
    logo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=150&q=80",
    location: "Hà Nội",
  },
  {
    id: "club-5",
    slug: "hcm-marathon-club",
    name: "HCM Marathon Club",
    sport: "Marathon",
    members: 5200,
    logo: "https://images.unsplash.com/photo-1552674605-15c21746360c?auto=format&fit=crop&w=150&q=80",
    location: "TP. Hồ Chí Minh",
  },
  {
    id: "club-6",
    slug: "hanoi-tennis-club",
    name: "Hanoi Tennis Club",
    sport: "Tennis",
    members: 850,
    logo: "https://images.unsplash.com/photo-1622227432807-91eb59a23d9b?auto=format&fit=crop&w=150&q=80",
    location: "Hà Nội",
  }
];

import { VerifyInterceptorModal } from "@/components/modals/VerifyInterceptorModal";

export function CauLacBoClient() {
  const [activeSport, setActiveSport] = useState("all");
  const [activeLocation, setActiveLocation] = useState("all");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const filteredClubs = CLUBS.filter(club => {
    const matchSport = activeSport === "all" || club.sport === activeSport;
    const matchLocation = activeLocation === "all" || club.location === activeLocation;
    return matchSport && matchLocation;
  });

  return (
    <>
      <Navbar />
      <div className="bg-[#f8fafc] min-h-screen pb-20 pt-8 sm:pt-12">
        <MainContainer>
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-3">Câu Lạc Bộ</h1>
              <p className="text-[15px] text-muted-foreground max-w-xl leading-relaxed">
                Khám phá các câu lạc bộ & hội nhóm. Tìm kiếm, tham gia và giao lưu với những người có cùng niềm đam mê thể thao.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Link href="/cau-lac-bo/dang-ky" className="w-full sm:w-auto">
                <Button 
                  className="w-full h-11 px-6 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-[14px] shadow-sm shadow-primary/20 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Tạo Câu lạc bộ
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="Tên câu lạc bộ, hội nhóm..."
                  className="w-full bg-secondary/30 border border-border/80 rounded-xl h-11 pl-10 pr-4 text-[14px] transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <select 
                  value={activeSport}
                  onChange={(e) => setActiveSport(e.target.value)}
                  className="w-full h-11 bg-secondary/30 border border-border/80 rounded-xl px-3 text-[14px] font-medium appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-foreground"
                >
                  <option value="all">Môn thể thao: Tất cả</option>
                  <option value="Pickleball">Pickleball</option>
                  <option value="Chạy bộ">Chạy bộ</option>
                  <option value="Cầu lông">Cầu lông</option>
                  <option value="Bóng đá">Bóng đá</option>
                  <option value="Marathon">Marathon</option>
                  <option value="Tennis">Tennis</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select 
                  value={activeLocation}
                  onChange={(e) => setActiveLocation(e.target.value)}
                  className="w-full h-11 bg-secondary/30 border border-border/80 rounded-xl px-3 text-[14px] font-medium appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-foreground"
                >
                  <option value="all">Tỉnh/thành: Tất cả</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {["Tất cả", "Có nhiều thành viên nhất", "Mới thành lập", "Gần tôi"].map((tag, i) => (
              <button
                key={tag}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${i === 0
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-foreground border-border/80 hover:bg-secondary"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredClubs.map((club) => (
              <ClubCard key={club.id} item={club} />
            ))}
            {filteredClubs.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                Không tìm thấy câu lạc bộ nào phù hợp với bộ lọc.
              </div>
            )}
          </div>

          {/* Load More */}
          {filteredClubs.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="h-11 px-8 rounded-xl border-border/80 font-bold hover:bg-secondary">
                Xem thêm
              </Button>
            </div>
          )}
        </MainContainer>
      </div>
      <Footer />
    </>
  );
}
