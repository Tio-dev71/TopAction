"use client";

import { motion } from "framer-motion";

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

interface Result {
  id: string;
  total_distance: number;
  profiles: Profile;
}

export function LeaderboardPodium({ results }: { results: Result[] }) {
  // if (!results || results.length === 0) return null;

  const top3 = results.slice(0, 3);
  const first = top3.length > 0 ? top3[0] : undefined;
  const second = top3.length > 1 ? top3[1] : undefined;
  const third = top3.length > 2 ? top3[2] : undefined;

  // Helper to render individual podium step
  const renderStep = (
    result: Result | undefined,
    place: number,
    heightClass: string,
    colorClass: string,
    delay: number
  ) => {
    const initials = result?.profiles?.full_name?.charAt(0) || "?";
    const name = result?.profiles?.full_name || "Chưa có VĐV";
    const avatarUrl = result?.profiles?.avatar_url;
    const distanceText = result ? `${(result.total_distance / 1000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} km` : "--";
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="flex flex-col items-center justify-end w-[32%]"
      >
        <div className="flex flex-col items-center mb-3 z-10 w-full">
          <div className={`relative mb-2 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border-[3px] border-white ${colorClass} text-white shadow-lg`}>
             {avatarUrl ? (
               <img src={avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
             ) : (
               <span className="text-xl font-bold">{result ? initials : "-"}</span>
             )}
             <div className={`absolute -bottom-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${colorClass} text-xs font-bold shadow-sm`}>
               {place}
             </div>
          </div>
          <span className="text-sm font-bold text-center leading-tight line-clamp-2 max-w-[90px] text-zinc-900">
            {name}
          </span>
          <span className="text-xs font-bold mt-1 text-slate-600">
            {distanceText}
          </span>
        </div>
        <div className={`w-full rounded-t-xl bg-gradient-to-b from-[#e5f1fb] to-[#c4e1f6] ${heightClass} shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-start justify-center pt-2 md:pt-4 border-t border-white/60`}>
          <span className="text-3xl sm:text-5xl font-extrabold text-[#9ecceb] drop-shadow-sm">{place}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative mb-6 flex justify-center items-end h-[260px] sm:h-[340px] rounded-2xl bg-gradient-to-b from-[#f4f9fd] to-white px-2 pb-0 pt-6 sm:pt-10 shadow-sm border border-blue-50 overflow-hidden">
      {/* Decorative background light rays */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none flex justify-center">
        <div className="absolute top-[10%] w-full h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>
        {/* Simple CSS rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] w-[150%] h-[150%] opacity-20" style={{
           background: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, #93c5fd 10deg 20deg)'
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        
        {/* Small stars/sparkles based on Image 1 */}
        <div className="absolute top-1/4 left-1/4 text-yellow-400 text-lg animate-pulse">✨</div>
        <div className="absolute top-1/3 right-1/4 text-yellow-400 text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
      </div>
      
      <div className="relative flex w-full max-w-[500px] items-end justify-center gap-1 sm:gap-3 z-10 bottom-0">
        {renderStep(second, 2, "h-[80px] sm:h-[120px]", "bg-slate-300", 0.4)}
        {renderStep(first, 1, "h-[110px] sm:h-[160px]", "bg-[#ffd700]", 0.6)}
        {renderStep(third, 3, "h-[60px] sm:h-[100px]", "bg-[#cd7f32]", 0.2)}
      </div>
    </div>
  );
}
