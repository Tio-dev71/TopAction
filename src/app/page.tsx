"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tournaments as rawTournaments } from "@/lib/mock-data";
import {
  Menu,
  X,
  Trophy,
  CalendarDays,
  Users,
  ArrowRight,
  ChevronRight,
  Flame,
  Timer,
  MapPin,
  UserPlus,
  Activity,
  Medal,
} from "lucide-react";

/* ─────────────────── map mock data ─────────────────── */

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const tournaments = rawTournaments.map((t, i) => ({
  id: t.id,
  slug: t.slug,
  title: t.title,
  category: t.category,
  cover: t.cover_image,
  startDate: fmtDate(t.start_date),
  endDate: fmtDate(t.end_date),
  participants: t.participant_count,
  distances: t.distances,
  location: t.location,
  featured: i === 0,
}));

/* ─────────────────── navbar ─────────────────── */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
            <Trophy className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">A</span>TUAN
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Trang chủ", href: "/" },
            { label: "Giải đấu", href: "#tournaments" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/dang-nhap" passHref>
            <Button size="sm" className="ml-3 gap-2 shadow-md shadow-primary/20">
              Đăng nhập
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-3">
            {[
              { label: "Trang chủ", href: "/" },
              { label: "Giải đấu", href: "#tournaments" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/dang-nhap" passHref>
                <Button size="sm" className="w-full gap-2 shadow-md shadow-primary/20">
                  Đăng nhập
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────────────── hero ─────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-20 right-0 h-[300px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[200px] w-[300px] rounded-full bg-chart-3/8 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Tag */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
            <Flame className="h-3.5 w-3.5" />
            NỀN TẢNG GIẢI ĐẤU TRỰC TUYẾN #1 VIỆT NAM
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Chinh phục{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              giới hạn
            </span>
            <br />
            cùng cộng đồng thể thao
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tham gia các giải chạy bộ, đạp xe và thể thao trực tuyến hàng đầu.
            Theo dõi thành tích, bảng xếp hạng và kết nối với hàng nghìn
            vận động viên trên toàn quốc.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="gap-2 px-8 shadow-lg shadow-primary/25 text-base"
              onClick={() => document.getElementById('tournaments')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Khám phá giải đấu
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 px-8 text-base"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Timer className="h-4 w-4" />
              Cách thức tham gia
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-14 flex justify-center gap-8 sm:gap-14">
            {[
              { value: "50+", label: "Giải đấu" },
              { value: "12K+", label: "Vận động viên" },
              { value: "300K km", label: "Đã chinh phục" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-primary sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── tournament card ─────────────────── */

function TournamentCard({
  tournament,
}: {
  tournament: (typeof tournaments)[0];
}) {
  return (
    <Link
      href={`/giai-dau/${tournament.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={tournament.cover}
          alt={tournament.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-white/90 text-xs font-semibold text-foreground backdrop-blur-sm"
          >
            {tournament.category}
          </Badge>
        </div>

        {/* Featured badge */}
        {tournament.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="gap-1 bg-chart-3/90 text-white backdrop-blur-sm border-0">
              <Flame className="h-3 w-3" />
              Nổi bật
            </Badge>
          </div>
        )}

        {/* Distance tags */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {tournament.distances.slice(0, 3).map((d) => (
            <span
              key={d}
              className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
            >
              {d}
            </span>
          ))}
          {tournament.distances.length > 3 && (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              +{tournament.distances.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-base font-bold leading-snug tracking-tight text-card-foreground group-hover:text-primary transition-colors sm:text-lg">
          {tournament.title}
        </h3>

        <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary/60" />
            <span>
              {tournament.startDate} – {tournament.endDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary/60" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-primary/60" />
            <span>
              <strong className="font-semibold text-foreground">
                {tournament.participants.toLocaleString("vi-VN")}
              </strong>{" "}
              người tham gia
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
            Xem chi tiết
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────── tournaments section ─────────────────── */

function TournamentsSection() {
  return (
    <section id="tournaments" className="relative py-16 sm:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/6 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <Trophy className="h-4 w-4" />
              Giải đấu
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Các giải đấu{" "}
              <span className="text-primary">đang mở</span>
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Lựa chọn giải đấu phù hợp và bắt đầu hành trình chinh phục mục tiêu
              của bạn ngay hôm nay.
            </p>
          </div>
          <Button variant="outline" className="gap-2 self-start sm:self-auto">
            Xem tất cả
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── footer ─────────────────── */

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold">ATUAN</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 ATUAN. Nền tảng giải đấu thể thao trực tuyến.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────── how it works section ─────────────────── */

function HowItWorksSection() {
  const steps = [
    {
      title: "Đăng ký tài khoản",
      description: "Tạo hồ sơ vận động viên miễn phí chỉ trong vài phút.",
      icon: <UserPlus className="h-6 w-6" />,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Chọn giải đấu",
      description: "Tìm kiếm giải đấu phù hợp với cấp độ và cự ly mong muốn.",
      icon: <Trophy className="h-6 w-6" />,
      color: "text-orange-500 bg-orange-500/10",
    },
    {
      title: "Hoàn thành thử thách",
      description: "Ghi nhận thành tích qua các thiết bị theo dõi thông minh kết nối hệ thống.",
      icon: <Activity className="h-6 w-6" />,
      color: "text-green-500 bg-green-500/10",
    },
    {
      title: "Nhận vinh danh",
      description: "Nhận chứng nhận điện tử và huy chương thật giao đến tận nhà.",
      icon: <Medal className="h-6 w-6" />,
      color: "text-primary bg-primary/10",
    },
  ];

  return (
    <section id="how-it-works" className="relative border-y border-border/60 bg-secondary/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Timer className="h-4 w-4" />
            Hướng dẫn
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            Cách thức tham gia
          </h2>
          <p className="mt-4 text-muted-foreground">
            Bốn bước đơn giản để hòa vào phong trào thể thao và chinh phục những mục tiêu mới.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
          {/* Connector line for desktop */}
          <div className="absolute top-12 left-[10%] right-[10%] hidden h-0.5 -translate-y-1/2 bg-border/80 lg:block" />

          {steps.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background ${step.color} shadow-sm shadow-primary/5`}>
                {step.icon}
                <div className="absolute -bottom-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background shadow-md">
                  {i + 1}
                </div>
              </div>
              <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed px-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── page ─────────────────── */

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorksSection />
        <TournamentsSection />
      </main>
      <Footer />
    </>
  );
}
