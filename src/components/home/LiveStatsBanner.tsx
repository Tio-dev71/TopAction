"use client";

import { motion } from "framer-motion";

const RunIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="13" cy="5" r="2" />
    <path d="M11 9l2 3v5l-4 4" />
    <path d="M13 12l4 4-2 5" />
    <path d="M7 11l4-2h4l3-2" />
  </svg>
);

const RoadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 22L10 2h4l6 20" />
    <path d="M12 14v4" />
    <path d="M12 4v4" />
  </svg>
);

export interface LiveActivity {
  name: string;
  distance: number;
}

interface LiveStatsBannerProps {
  todayParticipants: number;
  totalDistance: number;
  totalParticipants: number;
  recentActivities?: LiveActivity[];
}

const floatingLayout = [
  { top: "15%", left: "5%", size: "scale-100", delay: 0 },
  { top: "8%", left: "35%", size: "scale-100", delay: 1 },
  { top: "18%", left: "75%", size: "scale-75", delay: 2, hideOnMobile: true },
  { top: "78%", left: "40%", size: "scale-100", delay: 1.5 },
  { top: "82%", left: "75%", size: "scale-75", delay: 0.5, hideOnMobile: true },
];

export function LiveStatsBanner({
  todayParticipants,
  totalDistance,
  totalParticipants,
  recentActivities = [],
}: LiveStatsBannerProps) {
  // Use up to 5 recent activities, mapped to our predefined layout positions.
  const floatingStats = recentActivities.slice(0, 5).map((activity, i) => ({
    ...activity,
    ...floatingLayout[i],
  }));

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-slate-900 shadow-md">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2526')",
        }}
      />

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-slate-900/50" />

      {/* Main Content Area */}
      <div className="relative mx-auto flex min-h-[300px] w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
        {/* Floating Avatars */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {floatingStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 0 }}
              animate={{ y: [-10, 10, -10] }}
              transition={{
                repeat: Infinity,
                duration: 5 + i,
                delay: stat.delay,
                ease: "easeInOut",
              }}
              className={`absolute flex items-center gap-2.5 rounded-full bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md border border-white/40 ${
                stat.size
              } ${stat.hideOnMobile ? "hidden md:flex" : "flex"}`}
              style={{
                top: stat.top,
                // On small screens we might want to tweak left so they don't get extremely cut off, 
                // but using a dynamic class approach or just left percentage works well.
                left: stat.left,
              }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4169e1] text-white">
                <span className="font-sans text-xs font-bold leading-none italic tracking-wider">
                  R
                </span>
              </div>
              <div className="flex flex-col pr-1">
                <span className="text-sm font-bold leading-tight text-slate-800">
                  {stat.name}
                </span>
                <span className="mt-[1px] text-[11px] font-medium text-slate-500">
                  Vừa chạy được {stat.distance.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} km
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center Stats Grid */}
        <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-4">
          
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <h3 className="mb-3 text-center text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-lg">
              VĐV tập luyện trong ngày
            </h3>
            <div className="flex w-full max-w-[240px] items-center justify-center gap-2 rounded-xl bg-[#0eb2b2] px-4 py-3 text-white shadow-xl transition-transform duration-300 hover:scale-105">
              <RunIcon className="h-7 w-7 opacity-90" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {todayParticipants.toLocaleString("vi-VN")}
                </span>
                <span className="text-sm font-bold uppercase sm:text-base">
                  VĐV
                </span>
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            <h3 className="mb-3 text-center text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-lg">
              Tổng quãng đường
            </h3>
            <div className="flex w-full max-w-[240px] items-center justify-center gap-2 rounded-xl bg-[#0eb2b2] px-4 py-3 text-white shadow-xl transition-transform duration-300 hover:scale-105">
              <RoadIcon className="h-7 w-7 opacity-90" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {totalDistance.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}
                </span>
                <span className="text-sm font-bold uppercase sm:text-base">
                  KM
                </span>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            <h3 className="mb-3 text-center text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-lg">
              Tổng số VĐV
            </h3>
            <div className="flex w-full max-w-[240px] items-center justify-center gap-2 rounded-xl bg-[#0eb2b2] px-4 py-3 text-white shadow-xl transition-transform duration-300 hover:scale-105">
              <RunIcon className="h-7 w-7 opacity-90" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {totalParticipants.toLocaleString("vi-VN")}
                </span>
                <span className="text-sm font-bold uppercase sm:text-base">
                  VĐV
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
