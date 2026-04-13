"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

interface CharityProgressProps {
  tournamentId: string;
  donationTotal: number;
  donationGoal: number;
  donationDescription?: string;
  charityIframeUrl?: string | null;
}

export function CharityProgress({
  tournamentId,
  donationTotal: initialTotal,
  donationGoal,
  donationDescription,
  charityIframeUrl,
}: CharityProgressProps) {
  const [total, setTotal] = useState(initialTotal);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Lắng nghe realtime để cập nhật tổng số tiền quyên góp khi có GD thành công
  useRealtimeTable({
    table: "donations",
    filter: `tournament_id=eq.${tournamentId}`,
    onUpdate: (payload) => {
      const newRow = payload.new as any;
      const oldRow = payload.old as any;
      if (newRow.status === "paid" && oldRow.status !== "paid") {
        setTotal((prev) => prev + (newRow.amount || 0));
      }
    },
    onInsert: (payload) => {
      const newRow = payload.new as any;
      if (newRow.status === "paid") {
        setTotal((prev) => prev + (newRow.amount || 0));
      }
    },
  });

  const percent = donationGoal > 0
    ? Math.min(100, Math.round((total / donationGoal) * 100))
    : 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percent), 300);
    return () => clearTimeout(timer);
  }, [percent]);

  function fmtMoney(n: number) {
    return n.toLocaleString("vi-VN") + " VND";
  }

  if (donationGoal <= 0) return null;

  return (
    <div className="charity-progress">
      <h3 className="charity-progress__title">
        <Heart className="charity-progress__icon" fill="currentColor" />
        Thiện nguyện
      </h3>

      <div className="charity-progress__amounts">
        <span>
          Đã góp{" "}
          <strong className="charity-progress__raised">
            {fmtMoney(total)}
          </strong>
        </span>
        <span className="charity-progress__separator">/</span>
        <span className="charity-progress__goal-text">
          Mục tiêu {fmtMoney(donationGoal)}
        </span>
      </div>

      <div className="charity-progress__bar-container">
        <div
          className="charity-progress__bar"
          style={{ width: `${animatedPercent}%` }}
        >
          <span className="charity-progress__percent">{animatedPercent}%</span>
        </div>
      </div>

      {donationDescription && (
        <p className="charity-progress__description">{donationDescription}</p>
      )}

      {charityIframeUrl && (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <iframe 
            src={charityIframeUrl} 
            className="w-full h-[600px] border-none block" 
            title="Thống kê minh bạch"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      )}
    </div>
  );
}
