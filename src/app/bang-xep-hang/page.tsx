import { Metadata } from "next";
import { Search, Trophy } from "lucide-react";
import { MainContainer } from "@/components/layout/MainContainer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Bảng Xếp Hạng | TOPPLAY",
  description: "Bảng xếp hạng thành tích vận động viên",
};

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "pickleball", label: "Pickleball" },
  { id: "marathon", label: "Marathon" },
  { id: "tennis", label: "Tennis" },
];

const RANKINGS = [
  { rank: 1, name: "Nguyễn Văn A", points: 15420, trend: "up", avatar: "https://i.pravatar.cc/150?u=1" },
  { rank: 2, name: "Trần Thị B", points: 14200, trend: "same", avatar: "https://i.pravatar.cc/150?u=2" },
  { rank: 3, name: "Lê Văn C", points: 13950, trend: "down", avatar: "https://i.pravatar.cc/150?u=3" },
  { rank: 4, name: "Phạm Thị D", points: 12800, trend: "up", avatar: "https://i.pravatar.cc/150?u=4" },
  { rank: 5, name: "Hoàng Văn E", points: 12100, trend: "up", avatar: "https://i.pravatar.cc/150?u=5" },
];

export default function BangXepHangPage() {
  return (
    <>
      <Navbar />
      <div className="bg-[#f8fafc] min-h-screen pb-20 pt-8 sm:pt-12">
      <MainContainer>
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-3">Bảng Xếp Hạng</h1>
            <p className="text-[15px] text-muted-foreground max-w-xl leading-relaxed">
              Vinh danh các vận động viên có thành tích xuất sắc nhất trong hệ thống giải đấu TopPlay.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/60" />
              <input 
                type="text" 
                placeholder="Tìm kiếm vận động viên..." 
                className="w-full bg-white border border-border/80 rounded-xl h-11 pl-11 pr-4 text-[14px] shadow-sm transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-2 mb-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold whitespace-nowrap transition-colors ${
                i === 0 
                  ? "bg-[#1d4ed8] text-white shadow-sm" 
                  : "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {i === 0 && <Trophy className="h-4 w-4" />}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Top 3 Visual Header (Optional based on design) */}
        <div className="bg-gradient-to-br from-[#004e92] to-[#1d4ed8] rounded-[24px] p-8 mb-8 text-white shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552674605-15c21746360c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10 flex flex-col items-center">
             <Trophy className="h-16 w-16 text-yellow-400 mb-4" />
             <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-center">Bảng Vàng Danh Dự</h2>
             <p className="text-white/80 max-w-md text-center">Cập nhật liên tục từ kết quả của tất cả các giải đấu chính thức.</p>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-[24px] shadow-sm border border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-border/60">
                  <th className="py-4 px-6 font-semibold text-[13px] text-muted-foreground uppercase tracking-wider">Hạng</th>
                  <th className="py-4 px-6 font-semibold text-[13px] text-muted-foreground uppercase tracking-wider">Vận động viên</th>
                  <th className="py-4 px-6 font-semibold text-[13px] text-muted-foreground uppercase tracking-wider text-right">Điểm thưởng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {RANKINGS.map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-5 px-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] ${
                        row.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                        row.rank === 2 ? "bg-gray-100 text-gray-700" :
                        row.rank === 3 ? "bg-orange-100 text-orange-700" :
                        "text-muted-foreground"
                      }`}>
                        {row.rank}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <img src={row.avatar} alt={row.name} className="w-12 h-12 rounded-full border border-border/50 object-cover" />
                        <span className="font-bold text-[15px] text-foreground">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="font-extrabold text-[16px] text-[#1d4ed8]">{row.points.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </MainContainer>
    </div>
    <Footer />
    </>
  );
}
