"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const targetTime = new Date(targetDate).getTime();
  if (isNaN(targetTime)) return null;

  const diff = Math.max(0, targetTime - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const finished = diff === 0;

  if (finished) {
    return (
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground">Giải đấu đã bắt đầu!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3">
        <Clock className="h-3.5 w-3.5" />
        Còn lại
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { value: days, label: "Ngày" },
          { value: hours, label: "Giờ" },
          { value: minutes, label: "Phút" },
          { value: seconds, label: "Giây" },
        ].map((item) => (
          <div key={item.label}>
            <div className="rounded-lg bg-primary/10 py-2 text-xl font-extrabold text-primary tabular-nums">
              {String(item.value).padStart(2, "0")}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
