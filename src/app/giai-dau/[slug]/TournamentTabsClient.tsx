"use client";

import { useState, useEffect } from "react";
import { CollapsibleSection } from "./CollapsibleSection";
import { LiveStatsBanner } from "@/components/home/LiveStatsBanner";
import { LeaderboardPodium } from "./LeaderboardPodium";
import { Trophy, Users, Medal } from "lucide-react";
import { CharityProgress } from "./CharityProgress";

interface TabClientProps {
  tournament: any;
  todayParticipantsCount: number;
  totalDistanceBanner: number;
  recentActivities: any[];
  results: any[];
  participants: any[];
}

export function TournamentTabsClient({
  tournament,
  todayParticipantsCount,
  totalDistanceBanner,
  recentActivities,
  results,
  participants,
}: TabClientProps) {
  const [activeTab, setActiveTab] = useState("thong-tin");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['thong-tin', 'the-le', 'giai-thuong', 'thanh-vien'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <div id="tabs" className="relative">
      <div id="thanh-vien" className="absolute -top-24"></div>
      {/* Tabs Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-border/40 px-2 flex items-center overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleTabClick("thong-tin")}
          className={`px-6 py-4 border-b-[3px] font-bold text-[15px] whitespace-nowrap transition-colors ${
            activeTab === "thong-tin"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Thông tin
        </button>
        <button
          onClick={() => handleTabClick("the-le")}
          className={`px-6 py-4 border-b-[3px] font-bold text-[15px] whitespace-nowrap transition-colors ${
            activeTab === "the-le"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Thể lệ
        </button>
        <button
          onClick={() => handleTabClick("giai-thuong")}
          className={`px-6 py-4 border-b-[3px] font-bold text-[15px] whitespace-nowrap transition-colors ${
            activeTab === "giai-thuong"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Giải thưởng
        </button>
        <button
          onClick={() => handleTabClick("thanh-vien")}
          className={`px-6 py-4 border-b-[3px] font-bold text-[15px] whitespace-nowrap transition-colors ${
            activeTab === "thanh-vien"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Thành viên
        </button>
      </div>

      {/* Content Body */}
      <div className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Tab: Thông tin */}
        {activeTab === "thong-tin" && (
          <>
            {/* Charity Progress */}
            {tournament.donation_goal > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8">
                <CharityProgress
                  tournamentId={tournament.id}
                  donationTotal={tournament.donation_total || 0}
                  donationGoal={tournament.donation_goal || 500000000}
                  donationDescription="Mỗi lượt đăng ký là một hành động thiết thực nhằm lan tỏa tinh thần nhân ái..."
                  charityIframeUrl={tournament.charity_iframe_url}
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8">
              <CollapsibleSection
                title="Giới thiệu giải đấu"
                content={tournament.description}
                icon="activity"
                defaultExpanded={true}
              />
            </div>

            {/* Live Stats */}
            <LiveStatsBanner
              todayParticipants={todayParticipantsCount}
              totalDistance={totalDistanceBanner}
              totalParticipants={tournament.participant_count || 0}
              recentActivities={recentActivities.length > 0 ? recentActivities : []}
            />

            {/* Categories */}
            {tournament.categories && tournament.categories.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  Hạng mục thi đấu
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tournament.categories.map((cat: any) => (
                    <div key={cat.id} className="p-4 rounded-2xl border border-border bg-secondary/20 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[16px] text-foreground">{cat.name}</h4>
                        <span className="font-bold text-primary">{cat.price > 0 ? `${cat.price.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}</span>
                      </div>
                      {cat.distance && <p className="text-[13px] text-muted-foreground mb-3">Cự ly: {cat.distance}</p>}
                      <div className="mt-auto flex items-center justify-between text-[12px] font-medium">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {cat.registered_count}/{cat.capacity || '∞'} đã đăng ký
                        </span>
                        {cat.capacity && cat.registered_count >= cat.capacity && (
                          <span className="text-[#ef4444] font-bold">Hết chỗ</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            {results && results.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Medal className="h-6 w-6 text-[#f59e0b]" />
                  Bảng xếp hạng (Top 10)
                </h3>
                <LeaderboardPodium results={results} />
              </div>
            )}
          </>
        )}

        {/* Tab: Thể lệ */}
        {activeTab === "the-le" && (
          <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8 space-y-8 min-h-[400px]">
            {tournament.short_description ? (
              <CollapsibleSection
                title="Quy định chung & Thể lệ thi đấu"
                content={tournament.short_description}
                icon="info"
                defaultExpanded={true}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <span className="text-[15px] font-medium">Chưa có thông tin thể lệ cho giải đấu này.</span>
              </div>
            )}
          </div>
        )}

        {/* Tab: Giải thưởng */}
        {activeTab === "giai-thuong" && (
          <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8 space-y-8 min-h-[400px]">
            {tournament.rewards_description ? (
              <CollapsibleSection
                title={tournament.rewards_title || "Cơ cấu giải thưởng"}
                content={tournament.rewards_description}
                icon="medal"
                defaultExpanded={true}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <span className="text-[15px] font-medium">Chưa có thông tin giải thưởng.</span>
              </div>
            )}
          </div>
        )}

        {/* Tab: Thành viên */}
        {activeTab === "thanh-vien" && (
          <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 sm:p-8 min-h-[400px]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Danh sách thành viên tham gia
            </h3>
            
            {participants && participants.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {participants.map((p, idx) => (
                  <div key={idx} className="flex flex-col items-center p-4 bg-secondary/30 rounded-2xl border border-border/40 hover:bg-secondary transition-colors">
                    <img 
                      src={p.avatar_url || "https://ui-avatars.com/api/?name=" + (p.full_name || "User")} 
                      alt={p.full_name || "User"} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm mb-3"
                    />
                    <span className="text-[13px] font-bold text-center text-foreground line-clamp-1 w-full">
                      {p.full_name || "Thành viên ẩn danh"}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium text-center">
                      Vận động viên
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <span className="text-[15px] font-medium">Chưa có thành viên nào đăng ký.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
