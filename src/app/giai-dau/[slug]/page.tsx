"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  getTournamentBySlug,
  tournamentRules,
  organizers,
  leaderboardEntries,
  donations,
} from "@/lib/mock-data";
import {
  Trophy,
  CalendarDays,
  Users,
  ArrowLeft,
  Share2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Timer,
  Gauge,
  Map,
  Smartphone,
  CheckCircle,
  Dumbbell,
  Heart,
  Search,
  Medal,
  Building2,
  Handshake,
  Star,
  Clock,
} from "lucide-react";

/* ────────────── helpers ────────────── */

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function fmtMoney(n: number) {
  return n.toLocaleString("vi-VN") + " ₫";
}

function fmtTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} ngày trước`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours} giờ trước`;
  return "Vừa xong";
}

const ruleIcons: Record<string, React.ReactNode> = {
  running: <Dumbbell className="h-6 w-6" />,
  gauge: <Gauge className="h-6 w-6" />,
  map: <Map className="h-6 w-6" />,
  smartphone: <Smartphone className="h-6 w-6" />,
  "check-circle": <CheckCircle className="h-6 w-6" />,
};

/* ────────────── countdown hook ────────────── */

function useCountdown(target: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    finished: diff === 0,
  };
}

/* ────────────── Navbar (compact) ────────────── */

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Quay lại</span>
        </Link>
        <div className="flex-1" />
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-primary">A</span>TUAN
          </span>
        </Link>
        <div className="flex-1" />
        <Link href="/dang-nhap" passHref>
          <Button variant="outline" size="sm" className="gap-2">
            Đăng nhập
          </Button>
        </Link>
      </div>
    </header>
  );
}

/* ────────────── Hero ────────────── */

function HeroBanner({
  tournament,
}: {
  tournament: NonNullable<ReturnType<typeof getTournamentBySlug>>;
}) {
  return (
    <section className="relative">
      {/* Banner image */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <img
          src={tournament.cover_image}
          alt={tournament.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8">
          <Badge className="mb-3 bg-chart-3/90 text-white border-0">
            {tournament.category}
          </Badge>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl max-w-2xl">
            {tournament.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {fmtDate(tournament.start_date)} – {fmtDate(tournament.end_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {tournament.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {tournament.participant_count.toLocaleString("vi-VN")} người tham gia
            </span>
          </div>
          {/* Distance chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {tournament.distances.map((d) => (
              <span
                key={d}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────── Countdown Card ────────────── */

function CountdownCard({
  deadline,
  participantCount,
}: {
  deadline: string;
  participantCount: number;
}) {
  const { days, hours, minutes, seconds, finished } = useCountdown(deadline);

  const units = [
    { value: days, label: "Ngày" },
    { value: hours, label: "Giờ" },
    { value: minutes, label: "Phút" },
    { value: seconds, label: "Giây" },
  ];

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg shadow-primary/5">
      <div className="mb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {finished ? "Đã kết thúc đăng ký" : "Đăng ký kết thúc sau"}
        </p>
      </div>

      {/* Timer digits */}
      <div className="grid grid-cols-4 gap-2">
        {units.map((u) => (
          <div key={u.label} className="text-center">
            <div className="rounded-xl bg-primary/5 px-2 py-3">
              <span className="text-2xl font-extrabold tabular-nums text-primary sm:text-3xl">
                {u.value.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="mt-1.5 block text-[11px] font-medium text-muted-foreground">
              {u.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        size="lg"
        className="mt-5 w-full gap-2 text-base shadow-md shadow-primary/20"
        disabled={finished}
      >
        {finished ? "Hết hạn đăng ký" : "Đăng ký ngay"}
      </Button>

      {/* Participants preview */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Avatar key={i} className="h-7 w-7 border-2 border-card">
              <AvatarImage src={`https://api.dicebear.com/9.x/adventurer/svg?seed=p${i}`} />
              <AvatarFallback className="text-[10px]">VĐV</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          +{participantCount.toLocaleString("vi-VN")} đã đăng ký
        </span>
      </div>

      {/* Share */}
      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border/60 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary">
        <Share2 className="h-3.5 w-3.5" />
        Chia sẻ giải đấu
      </button>
    </div>
  );
}

/* ────────────── Rules Section ────────────── */

function RulesSection({ tournamentId }: { tournamentId: string }) {
  const rules = tournamentRules.filter((r) => r.tournament_id === tournamentId);

  return (
    <section className="mt-10">
      <SectionHeading icon={<CheckCircle className="h-5 w-5" />} title="Quy định sự kiện" />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex gap-4 rounded-xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
              {ruleIcons[rule.icon ?? "check-circle"]}
            </div>
            <div>
              <h4 className="text-sm font-bold">{rule.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {rule.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────── Tournament Info (collapsible markdown-like) ────────────── */

function TournamentInfo({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);

  // Simple markdown-like render
  const lines = description.trim().split("\n");
  const rendered = lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## "))
      return (
        <h3 key={i} className="mt-6 mb-2 text-base font-bold text-foreground">
          {trimmed.slice(3)}
        </h3>
      );
    if (trimmed.startsWith("- "))
      return (
        <li key={i} className="ml-4 text-sm text-muted-foreground leading-relaxed list-disc">
          {trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    if (trimmed.length === 0) return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-sm text-muted-foreground leading-relaxed">
        {trimmed.replace(/\*\*(.*?)\*\*/g, "$1")}
      </p>
    );
  });

  return (
    <section className="mt-10">
      <SectionHeading icon={<Star className="h-5 w-5" />} title="Thông tin giải đấu" />

      <div className="mt-5 rounded-xl border border-border/60 bg-card p-5 sm:p-6">
        <div
          className={`relative overflow-hidden transition-all duration-300 ${
            expanded ? "max-h-[4000px]" : "max-h-60"
          }`}
        >
          <div className="prose-sm">{rendered}</div>
          {!expanded && (
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          {expanded ? (
            <>
              Thu gọn <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Xem thêm <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* ────────────── Organizers ────────────── */

function OrganizersSection({ tournamentId }: { tournamentId: string }) {
  const orgs = organizers.filter((o) => o.tournament_id === tournamentId);
  const grouped = {
    organizer: orgs.filter((o) => o.type === "organizer"),
    sponsor: orgs.filter((o) => o.type === "sponsor"),
    partner: orgs.filter((o) => o.type === "partner"),
  };

  const typeLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    organizer: { label: "Đơn vị tổ chức", icon: <Building2 className="h-5 w-5" /> },
    sponsor: { label: "Nhà tài trợ", icon: <Heart className="h-5 w-5" /> },
    partner: { label: "Đơn vị đồng hành", icon: <Handshake className="h-5 w-5" /> },
  };

  return (
    <section className="mt-10">
      <SectionHeading icon={<Building2 className="h-5 w-5" />} title="Đơn vị tổ chức & Đồng hành" />

      <div className="mt-5 space-y-4">
        {(["organizer", "sponsor", "partner"] as const).map((type) => {
          const items = grouped[type];
          if (items.length === 0) return null;
          const { label, icon } = typeLabels[type];
          return (
            <div key={type}>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {icon}
                {label}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((org) => (
                  <div
                    key={org.id}
                    className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-sm font-bold text-primary">
                      {org.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{org.name}</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {org.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ────────────── Leaderboard ────────────── */

function LeaderboardSection({ tournamentId }: { tournamentId: string }) {
  const allEntries = leaderboardEntries.filter((e) => e.tournament_id === tournamentId);
  const [tab, setTab] = useState("individual");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const distances = useMemo(
    () => Array.from(new Set(allEntries.map((e) => e.distance_category))),
    [allEntries]
  );

  const filtered = useMemo(() => {
    return allEntries
      .filter((e) => (tab === "team" ? e.category_type === "team" : e.category_type === "individual"))
      .filter((e) => distanceFilter === "all" || e.distance_category === distanceFilter)
      .filter((e) => genderFilter === "all" || e.gender === genderFilter)
      .filter((e) =>
        searchQuery === ""
          ? true
          : e.participant_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.score - a.score);
  }, [allEntries, tab, distanceFilter, genderFilter, searchQuery]);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ["h-24", "h-32", "h-20"];
  const podiumColors = [
    "from-gray-300 to-gray-400",
    "from-yellow-400 to-amber-500",
    "from-amber-600 to-amber-700",
  ];
  const podiumLabels = ["🥈", "🥇", "🥉"];

  return (
    <section className="mt-10">
      <SectionHeading icon={<Trophy className="h-5 w-5" />} title="Bảng xếp hạng" />

      <div className="mt-5 rounded-xl border border-border/60 bg-card overflow-hidden">
        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="border-b border-border/60 px-4 pt-3">
            <TabsList className="bg-transparent gap-2 p-0">
              <TabsTrigger
                value="individual"
                className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4"
              >
                Cá nhân
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4"
              >
                Đội thi đấu
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 border-b border-border/60 px-4 py-3">
            <select
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs"
            >
              <option value="all">Tất cả cự ly</option>
              {distances.map((d) => (
                <option key={d} value={d ?? ""}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs"
            >
              <option value="all">Tất cả giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm vận động viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          <TabsContent value={tab} className="m-0">
            {/* Podium */}
            {top3.length >= 3 && (
              <div className="flex items-end justify-center gap-3 px-4 pt-6 pb-2 sm:gap-6">
                {podiumOrder.map((entry, i) => (
                  <div key={entry.id} className="flex flex-col items-center">
                    <Avatar className="h-12 w-12 border-2 border-card shadow-md sm:h-14 sm:w-14">
                      <AvatarImage src={entry.avatar_url ?? ""} />
                      <AvatarFallback className="text-xs">
                        {entry.participant_name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="mt-1.5 text-xs font-bold text-center max-w-[80px] truncate">
                      {entry.participant_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {entry.total_distance} km
                    </p>
                    <div
                      className={`mt-2 w-16 sm:w-20 ${podiumHeights[i]} rounded-t-lg bg-gradient-to-t ${podiumColors[i]} flex items-start justify-center pt-2`}
                    >
                      <span className="text-xl">{podiumLabels[i]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-3 w-12">#</th>
                    <th className="px-4 py-3">Vận động viên</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Cự ly</th>
                    <th className="px-4 py-3 hidden md:table-cell">Quãng đường</th>
                    <th className="px-4 py-3 hidden md:table-cell">Pace TB</th>
                    <th className="px-4 py-3 text-right">Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {(rest.length > 0 ? rest : filtered).map((entry, i) => {
                    const rank = top3.length >= 3 ? i + 4 : i + 1;
                    return (
                      <tr
                        key={entry.id}
                        className="border-b border-border/40 transition-colors hover:bg-secondary/40"
                      >
                        <td className="px-4 py-3 text-xs font-bold text-muted-foreground">
                          {rank}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={entry.avatar_url ?? ""} />
                              <AvatarFallback className="text-[10px]">
                                {entry.participant_name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm">{entry.participant_name}</p>
                              {entry.team_name && (
                                <p className="text-[11px] text-muted-foreground">
                                  {entry.team_name}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                          {entry.distance_category}
                        </td>
                        <td className="px-4 py-3 text-xs font-medium hidden md:table-cell">
                          {entry.total_distance} km
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                          {entry.avg_pace}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-block rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-bold text-primary">
                            {entry.score}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        Không tìm thấy kết quả phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

/* ────────────── Donations sidebar section ────────────── */

import { DonationWidget } from "@/components/DonationWidget";

/* ────────────── Section heading util ────────────── */

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
        {icon}
      </div>
      <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">{title}</h2>
    </div>
  );
}

/* ────────────── Mobile sticky CTA ────────────── */

function MobileStickyCTA({ finished }: { finished: boolean }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/90 p-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2 shadow-md shadow-primary/20"
          disabled={finished}
        >
          {finished ? "Hết hạn đăng ký" : "Đăng ký ngay"}
        </Button>
        <Button 
           variant="outline" 
           size="lg" 
           className="gap-2"
           onClick={() => document.getElementById('donation-widget')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Heart className="h-4 w-4" />
          Ủng hộ
        </Button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════ */

export default function TournamentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const tournament = getTournamentBySlug(slug);

  if (!tournament) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">404</h1>
          <p className="mt-2 text-muted-foreground">Không tìm thấy giải đấu.</p>
          <Link href="/">
            <Button className="mt-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const deadlineFinished =
    new Date(tournament.registration_deadline).getTime() < Date.now();

  return (
    <>
      <Navbar />

      <main className="flex-1 pb-24 lg:pb-12">
        {/* Hero banner */}
        <HeroBanner tournament={tournament} />

        {/* Body: main + sidebar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* Left / Main */}
            <div className="min-w-0">
              <RulesSection tournamentId={tournament.id} />
              <TournamentInfo description={tournament.description} />
              <OrganizersSection tournamentId={tournament.id} />
              <LeaderboardSection tournamentId={tournament.id} />
            </div>

            {/* Right / Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-6">
                <CountdownCard
                  deadline={tournament.registration_deadline}
                  participantCount={tournament.participant_count}
                />
                <DonationWidget tournamentId={tournament.id} slug={slug} />
              </div>
            </aside>
          </div>
        </div>

        {/* Show countdown card in-flow on mobile (above leaderboard was too far) */}
        <div className="mx-auto max-w-lg px-4 pt-6 lg:hidden">
          <CountdownCard
            deadline={tournament.registration_deadline}
            participantCount={tournament.participant_count}
          />
          <div className="mt-4">
            <DonationWidget tournamentId={tournament.id} slug={slug} />
          </div>
        </div>
      </main>

      <MobileStickyCTA finished={deadlineFinished} />
    </>
  );
}
