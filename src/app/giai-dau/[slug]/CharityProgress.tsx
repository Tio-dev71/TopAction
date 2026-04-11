"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface CharityProgressProps {
  donationTotal: number;
  donationGoal: number;
  donationDescription?: string;
}

export function CharityProgress({
  donationTotal,
  donationGoal,
  donationDescription,
}: CharityProgressProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const percent = donationGoal > 0
    ? Math.min(100, Math.round((donationTotal / donationGoal) * 100))
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
            {fmtMoney(donationTotal)}
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
    </div>
  );
}
