"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
}

export function CountdownTimer({
  targetDate,
  label = "Thời gian đăng ký còn",
}: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return (
      <div className="countdown">
        <div className="countdown__label-skeleton" />
        <div className="countdown__grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="countdown__cell-skeleton" />
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
      <div className="countdown countdown--finished">
        <p className="countdown__finished-text">
          <Clock className="countdown__finished-icon" />
          Đã hết hạn đăng ký!
        </p>
      </div>
    );
  }

  const items = [
    { value: days, label: "Ngày" },
    { value: hours, label: "Giờ" },
    { value: minutes, label: "Phút" },
    { value: seconds, label: "Giây" },
  ];

  return (
    <div className="countdown">
      <p className="countdown__label">{label}</p>
      <div className="countdown__grid">
        {items.map((item) => (
          <div key={item.label} className="countdown__cell">
            <span className="countdown__value">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="countdown__unit">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
