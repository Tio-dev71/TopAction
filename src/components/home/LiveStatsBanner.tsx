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
  type?: 'run' | 'donate';
  name: string;
  distance?: number;
  amount?: number;
}

interface LiveStatsBannerProps {
  todayParticipants: number;
  totalDistance: number;
  totalParticipants: number;
  recentActivities?: LiveActivity[];
}

function BubblingActivities({ activities }: { activities: LiveActivity[] }) {
  // If there's no real data yet, use some mock data to keep the banner lively and demonstrate the UI
  const mockActivities = [
    { name: "Nguyễn Văn A", distance: 5.2 },
    { name: "Trần Thị B", distance: 3.8 },
    { name: "Lê Hoàng C", distance: 10.5 },
    { name: "Phạm D", distance: 2.1 }
  ];

  const actualActivities = activities && activities.length > 0 ? activities : mockActivities;

  // We want to create enough bubbles to make it look lively, so if we have only a few activities, we can duplicate them.
  const displayActivities = actualActivities.length < 5 ? [...actualActivities, ...actualActivities] : actualActivities;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {displayActivities.map((activity, i) => {
        // Distribute horizontally
        const leftPos = 10 + (i * 30) % 70;
        // Stagger their appearances
        const delay = i * 2.5; 
        const isDonate = activity.type === 'donate';
        
        return (
          <motion.div
            key={i}
            initial={{ y: "100%", opacity: 0, scale: 0.8 }}
            animate={{ 
              y: ["100%", "-200%"],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 0.9],
              x: [0, (i % 2 === 0 ? 40 : -40), 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              delay: delay,
              ease: "linear"
            }}
            className="absolute flex items-center gap-2.5 rounded-full bg-white/10 px-3 py-1.5 shadow-lg backdrop-blur-md border border-white/20"
            style={{ 
              left: `${leftPos}%`, 
              bottom: '0%' 
            }}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${isDonate ? 'bg-pink-500' : 'bg-[#0eb2b2]'}`}>
              <span className="font-sans text-xs font-bold leading-none uppercase">
                {activity.name.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col pr-1">
              <span className="text-sm font-bold leading-tight text-white drop-shadow-md">
                {activity.name}
              </span>
              {isDonate ? (
                <span className="mt-[1px] text-[11px] font-medium text-pink-100">
                  Vừa ủng hộ {activity.amount?.toLocaleString("vi-VN")} đ
                </span>
              ) : (
                <span className="mt-[1px] text-[11px] font-medium text-teal-100">
                  Vừa chạy được {activity.distance?.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} km
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function LiveStatsBanner({
  todayParticipants,
  totalDistance,
  totalParticipants,
  recentActivities = [],
}: LiveStatsBannerProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-slate-900 shadow-xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2526')",
        }}
      />

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/50" />

      {/* Bubbling effect container */}
      <BubblingActivities activities={recentActivities} />

      {/* Main Content Area */}
      <div className="relative mx-auto flex min-h-[300px] w-full flex-col items-center justify-center px-4 py-10 sm:px-6 z-10">
        
        {/* Center Stats Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-4">
          
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
