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

const floatingStats = [
  {
    name: "PCCC Lê Tấn Đạt",
    distance: "4,14",
    top: "15%",
    left: "5%",
    size: "scale-100",
    delay: 0,
    mobileLeft: "-10%",
  },
  {
    name: "PCHM Phạm Hồng Vũ",
    distance: "1,90",
    top: "8%",
    left: "35%",
    size: "scale-100",
    delay: 1,
    mobileLeft: "30%",
  },
  {
    name: "PCBC Ngô Văn Rõ",
    distance: "2",
    top: "18%",
    left: "75%",
    size: "scale-75",
    delay: 2,
    hideOnMobile: true,
  },
  {
    name: "PCCL Lê Ngọc Huyền",
    distance: "3,33",
    top: "78%",
    left: "40%",
    size: "scale-100",
    delay: 1.5,
    mobileLeft: "10%",
  },
  {
    name: "Nguyễn Minh Long",
    distance: "2,50",
    top: "82%",
    left: "75%",
    size: "scale-75",
    delay: 0.5,
    hideOnMobile: true,
  },
];

export function LiveStatsBanner() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-slate-900 mx-4 sm:mx-6 lg:mx-8 rounded-2xl mb-16 sm:mb-24 mt-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2526')",
        }}
      />

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-slate-900/30" />

      {/* Main Content Area */}
      <div className="relative mx-auto flex min-h-[400px] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
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
                  Vừa chạy được {stat.distance} km
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center Stats Grid */}
        <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-6 lg:gap-8">
          
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-center text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] sm:text-[22px]">
              VĐV tập luyện trong ngày
            </h3>
            <div className="flex w-full max-w-[280px] items-center justify-center gap-3 rounded-2xl bg-[#00bfb3] px-5 py-4 text-white shadow-2xl transition-transform duration-300 hover:scale-105 sm:px-6">
              <RunIcon className="h-8 w-8 opacity-90 sm:h-9 sm:w-9" />
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  295
                </span>
                <span className="text-[16px] font-bold uppercase sm:text-xl">
                  VĐV
                </span>
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-center text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] sm:text-[22px]">
              Tổng quãng đường
            </h3>
            <div className="flex w-full max-w-[280px] items-center justify-center gap-3 rounded-2xl bg-[#00bfb3] px-5 py-4 text-white shadow-2xl transition-transform duration-300 hover:scale-105 sm:px-6">
              <RoadIcon className="h-8 w-8 opacity-90 sm:h-9 sm:w-9" />
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  32.385
                </span>
                <span className="text-[16px] font-bold uppercase sm:text-xl">
                  KM
                </span>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-center text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] sm:text-[22px]">
              Tổng số VĐV
            </h3>
            <div className="flex w-full max-w-[280px] items-center justify-center gap-3 rounded-2xl bg-[#00bfb3] px-5 py-4 text-white shadow-2xl transition-transform duration-300 hover:scale-105 sm:px-6">
              <RunIcon className="h-8 w-8 opacity-90 sm:h-9 sm:w-9" />
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  1.275
                </span>
                <span className="text-[16px] font-bold uppercase sm:text-xl">
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
