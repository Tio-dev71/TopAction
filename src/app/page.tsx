import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import {
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
import { FadeIn, FadeInStagger } from "@/components/animations/MotionWrapper";
import { NewsSection } from "@/components/home/NewsSection";
import { NewsPopup } from "@/components/home/NewsPopup";
import { PressSection } from "@/components/home/PressSection";
import { CarouselScroll } from "@/components/ui/carousel-scroll";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { QuickAccess } from "@/components/home/QuickAccess";
import { MembershipSection } from "@/components/home/MembershipSection";
import { EventCard } from "@/components/cards/EventCard";

export const metadata: Metadata = {
  title: "TOPPLAY - Giải đấu thể thao & tin tức nổi bật",
  description:
    "Khám phá giải đấu thể thao trực tuyến, đọc tin tức mới nhất và theo dõi các chiến dịch nổi bật từ TOPPLAY.",
};

/* ─────────────────── helpers ─────────────────── */

function fmtDate(iso: string | null) {
  if (!iso) return "TBD";
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/* ─────────────────── hero ─────────────────── */

function Hero({ tournament }: { tournament?: TournamentCardData }) {
  const bgImage = tournament?.home_cover_image || tournament?.cover_image || "https://images.unsplash.com/photo-1552674605-15c21746360c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
  const title = tournament?.display_title || tournament?.title || "Sải Bước Nghĩa Tình 2026";

  return (
    <section className="relative w-full pb-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#004e92] h-[400px] sm:h-[480px] w-full">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt="Hero background"
              className="w-full h-full object-cover object-center opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a2558]/90 via-[#103a8e]/80 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-center px-8 sm:px-16 lg:px-24">
            <FadeIn className="max-w-2xl">
              {/* Event Logo Mock */}
              <div className="mb-6 flex items-center gap-3 text-white">
                <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl uppercase tracking-tighter leading-none whitespace-pre-line">
                    {tournament?.category || "Sải Bước\nNghĩa Tình"}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest mt-1">Hành trình của yêu thương</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                {title}
              </h1>

              <p className="text-lg text-white/90 mb-8 font-medium">
                {tournament?.rewards_title || "Bước chân hôm nay – Hy vọng cho ngày mai"}
              </p>

              <div className="flex items-center gap-6 text-sm text-white/90 font-medium mb-8">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>{fmtDate(tournament?.start_date || null)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{tournament?.location || "Hồ Hoàn Kiếm, Hà Nội"}</span>
                </div>
              </div>

              <Link href={tournament ? `/giai-dau/${tournament.slug}/dang-ky` : "#"}>
                <Button size="lg" className="h-12 px-8 rounded-xl font-bold text-[15px] bg-[#22b39b] hover:bg-[#1d9e88] text-white border-0 shadow-lg shadow-teal-500/30 w-max">
                  ĐĂNG KÝ NGAY
                </Button>
              </Link>
            </FadeIn>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <button className="h-2 w-6 rounded-full bg-white"></button>
            <button className="h-2 w-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors"></button>
            <button className="h-2 w-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors"></button>
            <button className="h-2 w-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors"></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── tournament card ─────────────────── */

interface TournamentCardData {
  slug: string;
  title: string;
  display_title: string | null;
  category: string | null;
  cover_image: string | null;
  home_cover_image?: string | null;
  start_date: string | null;
  end_date: string | null;
  participant_count: number;
  location: string | null;
  is_featured: boolean;
  rewards_title?: string | null;
  categories?: { name: string; distance: string | null }[];
}

/* ─────────────────── featured section ─────────────────── */

function FeaturedSection({ tournaments }: { tournaments: TournamentCardData[] }) {
  return (
    <section id="featured" className="relative mt-8 sm:mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Nổi bật hôm nay
          </h2>
          <Link href="/su-kien" className="text-sm font-semibold text-[#1d4ed8] hover:underline">
            Xem tất cả
          </Link>
        </div>

        {tournaments.length > 0 ? (
          <FadeInStagger className="relative">
            <CarouselScroll>
              {tournaments.map((t) => {
                const dateRange = t.start_date ? `${fmtDate(t.start_date)}` : undefined;
                return (
                  <FadeIn key={t.slug} className="min-w-[280px] sm:min-w-[300px] max-w-[320px] flex-shrink-0 snap-start h-full pb-4">
                    <EventCard item={{
                      id: t.slug,
                      slug: t.slug,
                      title: t.display_title || t.title,
                      category: t.category || "Giải đấu",
                      image: t.home_cover_image || t.cover_image || "",
                      date: dateRange,
                      location: t.location || undefined,
                      price: "Từ 200.000đ", // Mock for now
                      status: "Đang mở đăng ký", // Mock for now
                      participants: t.participant_count,
                      isFeatured: t.is_featured,
                    }} />
                  </FadeIn>
                );
              })}
            </CarouselScroll>
            {/* Mock scroll button to match screenshot */}
            <button className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgb(0,0,0,0.15)] text-muted-foreground hover:text-foreground z-10 border border-border/50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </FadeInStagger>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">
              Chưa có sự kiện nổi bật nào.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────── how it works ─────────────────── */

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

        <FadeInStagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
          <div className="absolute top-12 left-[10%] right-[10%] hidden h-0.5 -translate-y-1/2 bg-border/80 lg:block" />
          {steps.map((step, i) => (
            <FadeIn key={step.title} className="relative flex flex-col items-center text-center">
              <div className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background ${step.color} shadow-sm shadow-primary/5`}>
                {step.icon}
                <div className="absolute -bottom-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background shadow-md">
                  {i + 1}
                </div>
              </div>
              <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed px-2">{step.description}</p>
            </FadeIn>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}

/* ─────────────────── page ─────────────────── */

export default async function Home() {
  const supabase = await createClient();

  // Fetch published tournaments from DB
  const { data: tournaments } = await supabase
    .from('tournaments')
    .select(`
      slug, title, display_title, category, cover_image, home_cover_image, start_date, end_date,
      participant_count, location, is_featured, rewards_title,
      categories:tournament_categories(name, distance)
    `)
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('start_date', { ascending: true })
    .limit(8);

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, title, excerpt, content, cover_image, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10);

  const { data: allPress } = await supabase
    .from('organizers')
    .select('id, name, logo_url, website_url')
    .eq('type', 'press');

  const uniquePress = Array.from(new Map(allPress?.map((p: any) => [p.logo_url || p.name, p])).values());

  return (
    <div className="overflow-x-hidden bg-white">
      <Navbar />
      <main className="flex-1 pb-16">
        <Hero tournament={tournaments?.[0]} />
        <GlobalSearch />

        {/* Nổi bật hôm nay */}
        <FeaturedSection tournaments={tournaments || []} />

        <QuickAccess />

        <div className="bg-secondary/10 border-y border-border/40 py-8">
          <MembershipSection />
        </div>

        <NewsSection posts={posts || []} />
      </main>
      <Footer />
    </div>
  );
}
