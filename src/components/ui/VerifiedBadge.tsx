import { CheckCircle, ShieldCheck, Award, Star, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeType = "personal" | "club" | "organizer" | "top-organizer" | "top-choice";

interface VerifiedBadgeProps {
  type: BadgeType;
  className?: string;
  showText?: boolean;
}

const BADGE_CONFIG = {
  personal: {
    label: "TopPlay Verified",
    icon: CheckCircle,
    colors: "bg-blue-100 text-blue-600 border-blue-200",
    iconColor: "text-blue-600"
  },
  club: {
    label: "CLB Verified",
    icon: ShieldCheck,
    colors: "bg-teal-100 text-teal-700 border-teal-200",
    iconColor: "text-teal-600"
  },
  organizer: {
    label: "Organizer Verified",
    icon: Award,
    colors: "bg-purple-100 text-purple-700 border-purple-200",
    iconColor: "text-purple-600"
  },
  "top-organizer": {
    label: "Top Organizer",
    icon: Star,
    colors: "bg-amber-100 text-amber-700 border-amber-200",
    iconColor: "text-amber-600"
  },
  "top-choice": {
    label: "Top Choice Club",
    icon: Medal,
    colors: "bg-orange-100 text-orange-700 border-orange-200",
    iconColor: "text-orange-600"
  }
};

export function VerifiedBadge({ type, className, showText = true }: VerifiedBadgeProps) {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;

  if (!showText) {
    return (
      <div className={cn("inline-flex items-center justify-center shrink-0 rounded-full", className)} title={config.label}>
        <Icon className={cn("w-4 h-4 fill-current", config.iconColor)} />
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider", config.colors, className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}
