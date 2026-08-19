import "./tournament-detail.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DonationWidget } from "@/components/DonationWidget";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Trophy, CalendarDays, Users, ArrowLeft, MapPin,
  Dumbbell, Gauge, Map, Smartphone, CheckCircle,
  Heart, Building2, Handshake, Star, Clock, UserPlus,
  Medal, Share2, Mountain, Activity, Footprints, Newspaper
} from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { CharityProgress } from "./CharityProgress";
import { FacebookEmbed } from "./FacebookEmbed";
import { FadeIn, FadeInStagger } from "@/components/animations/MotionWrapper";
import { CollapsibleSection } from "./CollapsibleSection";
import { LiveStatsBanner } from "@/components/home/LiveStatsBanner";
import { LeaderboardPodium } from "./LeaderboardPodium";
import Marquee from "react-fast-marquee";
import { TournamentTabsClient } from "./TournamentTabsClient";

/* ────────────── helpers ────────────── */

function fmtDate(iso: string | null) {
  if (!iso) return "TBD";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function fmtMoney(n: number) {
  return n.toLocaleString("vi-VN");
}

const ruleIcons: Record<string, React.ReactNode> = {
  running: <Footprints className="h-7 w-7" />,
  activity: <Activity className="h-7 w-7" />,
  dumbbell: <Dumbbell className="h-7 w-7" />,
  gauge: <Gauge className="h-7 w-7" />,
  map: <Map className="h-7 w-7" />,
  smartphone: <Smartphone className="h-7 w-7" />,
  "check-circle": <CheckCircle className="h-7 w-7" />,
  sport: <Trophy className="h-7 w-7" />,
  pace: <Gauge className="h-7 w-7" />,
  mountain: <Mountain className="h-7 w-7" />,
};

/* ────────────── metadata ────────────── */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: t } = await supabase.from('tournaments').select('title, short_description, cover_image, slug').eq('slug', slug).single();

  const title = t?.title ? `${t.title} | TOPPLAY` : 'Giải đấu | TOPPLAY';
  const descriptionText = t?.short_description?.replace(/<[^>]*>?/gm, '') || 'Thông tin giải đấu thể thao trực tuyến';
  const description = descriptionText.substring(0, 160);
  const images = t?.cover_image ? [t.cover_image] : ['https://topplay.vn/images/default-share.jpg'];
  const url = `https://topplay.vn/giai-dau/${t?.slug || slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'TOPPLAY',
      images: [
        {
          url: images[0],
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

/* ────────────── page ────────────── */

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tournament } = await supabase
    .from("tournaments")
    .select(`
      *,
      categories:tournament_categories(*),
      rules:tournament_rules(*),
      sections:tournament_sections(*),
      organizers:organizers(*)
    `)
    .eq("slug", slug)
    .order('sort_order', { referencedTable: 'tournament_categories' })
    .order('sort_order', { referencedTable: 'tournament_rules' })
    .order('sort_order', { referencedTable: 'organizers' })
    .single();

  if (!tournament || (tournament.status !== 'published' && tournament.status !== 'closed')) {
    notFound();
  }

  // Get donations
  const { data: donations, count: donationCount } = await supabase
    .from("donations")
    .select("id, donor_name, amount, message, is_anonymous, created_at", { count: 'exact' })
    .eq("tournament_id", tournament.id)
    .eq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(50);

  const donationList = (donations || []).map((d: any) => ({
    ...d,
    donor_name: d.is_anonymous ? "Ẩn danh" : d.donor_name,
  }));

  // Get Leaderboard
  const { data: results } = await supabase
    .from('tournament_results')
    .select(`
      *,
      profiles:user_id(full_name, avatar_url, club_name),
      category:category_id(name)
    `)
    .eq('tournament_id', tournament.id)
    .order('total_distance', { ascending: false })
    .limit(10);

  // Get Stats for Banner
  const { data: allResults } = await supabase
    .from('tournament_results')
    .select('total_distance, updated_at, profiles:user_id(full_name)')
    .eq('tournament_id', tournament.id)
    .order('updated_at', { ascending: false });

  let totalDistanceBanner = 0;
  let todayParticipantsCount = 0;
  const recentActivities: any[] = [];

  if (allResults) {
    const today = new Date().toISOString().split('T')[0];
    allResults.forEach((r: any) => {
      totalDistanceBanner += (r.total_distance || 0) / 1000;
      if (r.updated_at && r.updated_at.startsWith(today)) {
        todayParticipantsCount++;
      }
    });

    recentActivities.push(...allResults.slice(0, 5).map((r: any) => ({
      name: r.profiles?.full_name || 'VĐV Ẩn danh',
      distance: (r.total_distance || 0) / 1000,
      type: 'run' as 'run'
    })));
  }

  if (donationList && donationList.length > 0) {
    recentActivities.push(...donationList.slice(0, 5).map((d: any) => ({
      name: d.donor_name || 'Ẩn danh',
      amount: d.amount,
      type: 'donate' as 'donate'
    })));
  }

  // Get all participants for avatars and members tab
  // Use admin client to bypass RLS on registrations table
  const supabaseAdmin = await createAdminClient();
  const { data: latestRegistrations } = await supabaseAdmin
    .from('registrations')
    .select('profiles:user_id(full_name, avatar_url)')
    .eq('tournament_id', tournament.id)
    .in('status', ['paid', 'approved', 'pending', 'registered', 'confirmed'])
    .order('created_at', { ascending: false });

  const participantAvatars = latestRegistrations
    ?.slice(0, 5)
    ?.map((r: any) => r.profiles?.avatar_url)
    .filter(Boolean) || [];

  const participantsList = latestRegistrations
    ?.map((r: any) => r.profiles)
    .filter(Boolean) || [];

  // Check registration window
  const now = new Date().toISOString();
  const regOpen = !tournament.registration_close_at || now < tournament.registration_close_at;
  const regNotYetOpen = tournament.registration_open_at && now < tournament.registration_open_at;

  // Organize sponsors by type
  const organizers = (tournament.organizers || []).filter((o: any) => o.type === 'organizer');
  const sponsors = (tournament.organizers || []).filter((o: any) => o.type === 'sponsor');
  const partners = (tournament.organizers || []).filter((o: any) => o.type === 'partner');
  const press = (tournament.organizers || []).filter((o: any) => o.type === 'press');

  // Registration fee display
  const minPrice = tournament.categories?.length > 0
    ? Math.min(...tournament.categories.map((c: any) => c.price || 0))
    : 0;
  const feeDisplay = tournament.registration_fee_description
    || (minPrice > 0 ? `${fmtMoney(minPrice)} VND` : 'Miễn phí');

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 overflow-x-hidden font-sans">
      <Navbar />

      {/* ─── Hero Banner ─── */}
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px]">
        {tournament.cover_image ? (
          <img src={tournament.cover_image} alt="Event cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#004e92] to-[#103a8e]" />
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 sm:-mt-24 lg:-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ─── Left Column (2/3) ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title Card */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-border/40 p-6 sm:p-8">
              {tournament.category && (
                <span className="inline-flex items-center rounded-full bg-[#22b39b] px-3 py-1 text-[13px] font-bold text-white shadow-sm mb-4">
                  {tournament.category}
                </span>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
                {tournament.title}
              </h1>

              {organizers.length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-full bg-secondary overflow-hidden border border-border flex shrink-0">
                    {organizers[0].logo_url ? (
                      <img src={organizers[0].logo_url} alt={organizers[0].name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Building2 className="w-5 h-5 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">Đơn vị tổ chức</p>
                    <p className="text-[15px] font-bold text-foreground">{organizers[0].name}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 border-t border-border/60 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">Thời gian</p>
                    <p className="text-[15px] font-bold text-foreground">{fmtDate(tournament.start_date)}</p>
                  </div>
                </div>
                {tournament.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#f59e0b]" />
                    </div>
                    <div>
                      <p className="text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">Địa điểm</p>
                      <p className="text-[15px] font-bold text-foreground line-clamp-1">{tournament.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <TournamentTabsClient 
              tournament={tournament}
              todayParticipantsCount={todayParticipantsCount}
              totalDistanceBanner={totalDistanceBanner}
              recentActivities={recentActivities}
              results={results || []}
              participants={participantsList}
            />
          </div>

          {/* ─── Right Column (1/3) Sticky Sidebar ─── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Registration Card */}
            <div className="sticky top-24 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-border/40 p-6 sm:p-8">
              <h3 className="text-xl font-extrabold text-foreground mb-2">Đăng ký tham gia</h3>

              {tournament.registration_close_at && (
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#ef4444] mb-4">
                  <Clock className="h-4 w-4" />
                  <span>Thời gian đóng cổng: {fmtDate(tournament.registration_close_at)}</span>
                </div>
              )}

              <div className="text-3xl font-extrabold text-primary mb-6">
                {feeDisplay}
              </div>

              {regOpen && !regNotYetOpen ? (
                <Link href={`/giai-dau/${slug}/dang-ky`} className="block w-full">
                  <Button className="w-full h-14 rounded-xl text-base font-bold bg-[#1d4ed8] shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5">
                    Đăng ký ngay
                  </Button>
                </Link>
              ) : regNotYetOpen ? (
                <Button className="w-full h-14 rounded-xl text-base font-bold" disabled>
                  Chưa mở đăng ký
                </Button>
              ) : (
                <Button className="w-full h-14 rounded-xl text-base font-bold" disabled>
                  Đã hết hạn đăng ký
                </Button>
              )}

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#22b39b]" />
                  <span className="text-[14px] font-medium text-muted-foreground">Nhận bộ Racekit tiêu chuẩn</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#22b39b]" />
                  <span className="text-[14px] font-medium text-muted-foreground">Huy chương hoàn thành</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#22b39b]" />
                  <span className="text-[14px] font-medium text-muted-foreground">E-Certificate ghi nhận thành tích</span>
                </div>
              </div>

              {/* Participants summary */}
              <div className="mt-8 pt-6 border-t border-border/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    {participantAvatars.slice(0, 3).map((url, i) => (
                      <img key={i} src={url} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    ))}
                  </div>
                  <span className="text-[14px] font-semibold text-foreground">
                    {tournament.participant_count.toLocaleString("vi-VN")} người tham gia
                  </span>
                </div>
                <Link href="#thanh-vien" className="block w-full">
                  <Button variant="outline" className="w-full h-11 rounded-xl text-[14px] font-bold">
                    Xem danh sách
                  </Button>
                </Link>
              </div>
            </div>

            {/* Donation Widget */}
            <DonationWidget
              tournamentId={tournament.id}
              slug={slug}
              initialDonations={donationList}
              initialTotal={tournament.donation_total || 0}
              initialCount={donationCount || 0}
            />

            {/* Facebook Embed */}
            {tournament.facebook_page_url && (
              <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-4">
                <FacebookEmbed pageUrl={tournament.facebook_page_url} pageName={tournament.title} />
              </div>
            )}
          </div>
        </div>
      </main>

        {/* ─── Organizers Section (Full Width) ─── */}
      {(organizers.length > 0 || sponsors.length > 0 || partners.length > 0 || press.length > 0) && (
        <section className="w-full bg-card border-t border-border/60 pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="td-organizers">
              {organizers.length > 0 && (
                <FadeIn className="td-organizers__section">
                  <h3 className="td-organizers__title">
                    <Building2 className="td-organizers__title-icon" />
                    Đơn vị tổ chức
                  </h3>
                  <div className="td-organizers__logos">
                    {organizers.map((org: any) => {
                      const logoContent = org.logo_url ? (
                        <img src={org.logo_url} alt={org.name} className="td-organizers__logo-img" />
                      ) : (
                        <div className="td-organizers__logo-placeholder">
                          <Building2 className="h-8 w-8" />
                          <span>{org.name}</span>
                        </div>
                      );
                      return (
                        <div key={org.id} className="td-organizers__logo-card">
                          {org.website_url ? (
                            <a href={org.website_url} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">{logoContent}</a>
                          ) : logoContent}
                          {org.description && (
                            <p className="td-organizers__logo-desc">{org.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </FadeIn>
              )}

              {sponsors.length > 0 && (
                <FadeIn className="td-organizers__section">
                  <h3 className="td-organizers__title">
                    <Star className="td-organizers__title-icon" />
                    Đơn vị tài trợ
                  </h3>
                  <div className="td-organizers__logos">
                    {sponsors.map((sp: any) => {
                      const logoContent = sp.logo_url ? (
                        <img src={sp.logo_url} alt={sp.name} className="td-organizers__logo-img" />
                      ) : (
                        <div className="td-organizers__logo-placeholder">
                          <Star className="h-8 w-8" />
                          <span>{sp.name}</span>
                        </div>
                      );
                      return (
                        <div key={sp.id} className="td-organizers__logo-card">
                          {sp.website_url ? (
                            <a href={sp.website_url} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">{logoContent}</a>
                          ) : logoContent}
                        </div>
                      );
                    })}
                  </div>
                </FadeIn>
              )}

              {partners.length > 0 && (
                <FadeIn className="td-organizers__section">
                  <h3 className="td-organizers__title">
                    <Handshake className="td-organizers__title-icon" />
                    Đơn vị đồng hành
                  </h3>
                  <div className="td-organizers__logos-wrap">
                    <Marquee gradient={true} gradientColor="var(--card)" speed={30} autoFill={true}>
                      {partners.map((pt: any) => {
                        const logoContent = pt.logo_url ? (
                          <img src={pt.logo_url} alt={pt.name} className="td-organizers__logo-img" />
                        ) : (
                          <div className="td-organizers__logo-placeholder">
                            <Handshake className="h-8 w-8" />
                            <span>{pt.name}</span>
                          </div>
                        );
                        return (
                          <div key={pt.id} className="td-organizers__logo-card">
                            {pt.website_url ? (
                              <a href={pt.website_url} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">{logoContent}</a>
                            ) : logoContent}
                          </div>
                        );
                      })}
                    </Marquee>
                  </div>
                </FadeIn>
              )}

              {press.length > 0 && (
                <FadeIn className="td-organizers__section">
                  <h3 className="td-organizers__title">
                    <Newspaper className="td-organizers__title-icon" />
                    Báo chí
                  </h3>
                  <div className="td-organizers__logos-wrap">
                    <Marquee gradient={true} gradientColor="var(--card)" speed={30} autoFill={true}>
                      {press.map((pr: any) => {
                        const logoContent = pr.logo_url ? (
                          <img src={pr.logo_url} alt={pr.name} className="td-organizers__logo-img" />
                        ) : (
                          <div className="td-organizers__logo-placeholder">
                            <Newspaper className="h-8 w-8" />
                            <span>{pr.name}</span>
                          </div>
                        );
                        return (
                          <div key={pr.id} className="td-organizers__logo-card">
                            {pr.website_url ? (
                              <a href={pr.website_url} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">{logoContent}</a>
                            ) : logoContent}
                          </div>
                        );
                      })}
                    </Marquee>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
