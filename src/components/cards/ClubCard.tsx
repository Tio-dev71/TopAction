"use client";

import Link from "next/link";
import { Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ClubCardProps {
  id: string;
  slug: string;
  name: string;
  logo: string;
  sport: string;
  members: number;
}

export function ClubCard({ item }: { item: ClubCardProps }) {
  return (
    <Link
      href={`/cau-lac-bo/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 w-full"
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-secondary/50">
          <img
            src={item.logo}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <div className="mt-2 flex flex-col gap-1.5 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 shrink-0" />
              <span>Thể thao: <span className="font-semibold text-foreground">{item.sport}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" />
              <span>Thành viên: <span className="font-semibold text-foreground">{item.members.toLocaleString("vi-VN")}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5">
        <Button variant="outline" className="w-full h-10 rounded-xl border-border/80 font-semibold hover:bg-primary hover:text-white hover:border-primary transition-colors">
          Tham gia
        </Button>
      </div>
    </Link>
  );
}
