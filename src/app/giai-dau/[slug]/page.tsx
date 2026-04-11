import "./tournament-detail.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { DonationWidget } from "@/components/DonationWidget";
import { createClient } from "@/lib/supabase/server";
import {
  Trophy, CalendarDays, Users, ArrowLeft, MapPin,
  Dumbbell, Gauge, Map, Smartphone, CheckCircle,
  Heart, Building2, Handshake, Star, Clock, UserPlus,
  Medal, Share2, Mountain, Activity, Footprints
} from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { CharityProgress } from "./CharityProgress";
import { FacebookEmbed } from "./FacebookEmbed";
import { FadeIn, FadeInStagger } from "@/components/animations/MotionWrapper";
import { CollapsibleDescription } from "./CollapsibleDescription";
import { LiveStatsBanner } from "@/components/home/LiveStatsBanner";

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
  const { data: t } = await supabase.from('tournaments').select('title, short_description').eq('slug', slug).single();
  return {
    title: t ? `${t.title} | TOPACTION` : 'Giải đấu | TOPACTION',
    description: t?.short_description || 'Thông tin giải đấu thể thao trực tuyến',
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
  const { data: donations } = await supabase
    .from("donations")
    .select("id, donor_name, amount, message, is_anonymous, created_at")
    .eq("tournament_id", tournament.id)
    .eq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(10);

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
  const recentActivities = [];

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
    })));
  }

  // Check registration window
  const now = new Date().toISOString();
  const regOpen = !tournament.registration_close_at || now < tournament.registration_close_at;
  const regNotYetOpen = tournament.registration_open_at && now < tournament.registration_open_at;

  // Organize sponsors by type
  const organizers = (tournament.organizers || []).filter((o: any) => o.type === 'organizer');
  const sponsors = (tournament.organizers || []).filter((o: any) => o.type === 'sponsor');
  const partners = (tournament.organizers || []).filter((o: any) => o.type === 'partner');

  // Registration fee display
  const minPrice = tournament.categories?.length > 0
    ? Math.min(...tournament.categories.map((c: any) => c.price || 0))
    : 0;
  const feeDisplay = tournament.registration_fee_description
    || (minPrice > 0 ? `${fmtMoney(minPrice)} VND` : 'Miễn phí');

  return (
    <>
      <Navbar />
      <main className="tournament-detail">
        {/* ─── Hero Banner ─── */}
        <section className="td-hero">
          <div className="td-hero__bg">
            {tournament.cover_image ? (
              <img src={tournament.cover_image} alt="" className="td-hero__bg-img" />
            ) : (
              <div className="td-hero__bg-gradient" />
            )}
            <div className="td-hero__overlay" />
          </div>

          <div className="td-hero__content">
            <FadeIn delay={0.1}>
              <Link href="/" className="td-hero__back">
                <ArrowLeft className="h-3.5 w-3.5" />
                Trang chủ
              </Link>
            </FadeIn>

            <div className="td-hero__layout">
              {/* Left - Title info */}
              <FadeIn delay={0.2} className="td-hero__info">
                {tournament.category && (
                  <Badge variant="secondary" className="td-hero__badge">{tournament.category}</Badge>
                )}
              </FadeIn>

              {/* Right - Sponsors on banner */}
              {(sponsors.length > 0 || partners.length > 0) && (
                <FadeIn delay={0.3} className="td-hero__sponsors">
                  {sponsors.length > 0 && (
                    <div className="td-hero__sponsor-group">
                      <p className="td-hero__sponsor-label">Đơn vị tài trợ</p>
                      <div className="td-hero__sponsor-logos">
                        {sponsors.map((s: any) => (
                          <div key={s.id} className="td-hero__sponsor-logo-wrap">
                            {s.logo_url ? (
                              <img src={s.logo_url} alt={s.name} className="td-hero__sponsor-logo" />
                            ) : (
                              <span className="td-hero__sponsor-name">{s.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {partners.length > 0 && (
                    <div className="td-hero__sponsor-group">
                      <p className="td-hero__sponsor-label">Đơn vị đồng hành</p>
                      <div className="td-hero__sponsor-logos">
                        {partners.map((p: any) => (
                          <div key={p.id} className="td-hero__sponsor-logo-wrap">
                            {p.logo_url ? (
                              <img src={p.logo_url} alt={p.name} className="td-hero__sponsor-logo" />
                            ) : (
                              <span className="td-hero__sponsor-name">{p.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </FadeIn>
              )}
            </div>
          </div>
        </section>

        {/* ─── Main Content Card ─── */}
        <div className="td-body">
          <div className="td-body__grid">
            {/* ─── Left Column ─── */}
            <div className="td-main">
              {/* White Card Container */}
              <FadeIn className="td-card">
                {/* Tabs-like badges */}
                <div className="td-card__tabs">
                  <Badge className="td-card__tab td-card__tab--active">
                    <Heart className="h-3.5 w-3.5" />
                    Quyên góp
                  </Badge>
                  <Badge variant="outline" className="td-card__tab">
                    <Building2 className="h-3.5 w-3.5" />
                    Doanh nghiệp
                  </Badge>
                </div>

                {/* Title & meta */}
                <h2 className="td-card__title">{tournament.title}</h2>

                <div className="td-card__meta">
                  <div className="td-card__meta-item">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <span>Thời gian diễn ra: {fmtDate(tournament.start_date)} - {fmtDate(tournament.end_date)}</span>
                  </div>
                  {tournament.location && (
                    <div className="td-card__meta-item">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{tournament.location}</span>
                    </div>
                  )}
                  <div className="td-card__meta-item">
                    <Mountain className="h-4 w-4 text-primary" />
                    <span>Cự ly: {tournament.categories?.[0]?.distance || 'Không giới hạn'}</span>
                  </div>
                </div>

                {/* ─── Charity Progress ─── */}
                <CharityProgress
                  donationTotal={tournament.donation_total || 0}
                  donationGoal={tournament.donation_goal || 500000000}
                  donationDescription={
                    tournament.donation_description ||
                    "Mỗi lượt đăng ký là 100.000 VND gửi đến Quỹ, tiếp sức điều trị cho trẻ em mắc bệnh hiểm."
                  }
                />

                {/* ─── Rules Section ─── */}
                {tournament.rules && tournament.rules.length > 0 && (
                  <div className="td-rules">
                    <div className="td-rules__header">
                      <h3 className="td-rules__title">Quy định sự kiện</h3>
                      <button className="td-rules__view-all">Xem tất cả</button>
                    </div>
                    <FadeInStagger className="td-rules__grid">
                      {tournament.rules.map((rule: any) => (
                        <FadeIn key={rule.id} className="td-rules__item">
                          <div className="td-rules__icon-wrap">
                            {ruleIcons[rule.icon || rule.rule_type || ''] || <CheckCircle className="h-7 w-7" />}
                          </div>
                          <h4 className="td-rules__item-title">{rule.title}</h4>
                          {rule.content && (
                            <p className="td-rules__item-desc">{rule.content}</p>
                          )}
                        </FadeIn>
                      ))}
                    </FadeInStagger>
                  </div>
                )}

                {/* ─── Live Stats Banner ─── */}
                <div className="my-8">
                  <LiveStatsBanner
                    todayParticipants={todayParticipantsCount}
                    totalDistance={totalDistanceBanner}
                    totalParticipants={tournament.participant_count || 0}
                    recentActivities={recentActivities.length > 0 ? recentActivities : []}
                  />
                </div>

                {/* ─── Categories ─── */}
                {tournament.categories && tournament.categories.length > 0 && (
                  <div className="td-categories">
                    <h3 className="td-section-title">
                      <Trophy className="h-5 w-5 text-primary" />
                      Hạng mục thi đấu
                    </h3>
                    <FadeInStagger className="td-categories__grid">
                      {tournament.categories.map((cat: any) => (
                        <FadeIn key={cat.id} className="td-categories__card">
                          <div className="td-categories__card-header">
                            <h4 className="td-categories__name">{cat.name}</h4>
                            <Badge variant="outline" className="td-categories__price">
                              {cat.price > 0 ? `${cat.price.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
                            </Badge>
                          </div>
                          {cat.distance && (
                            <p className="td-categories__distance">Cự ly: {cat.distance}</p>
                          )}
                          <div className="td-categories__count">
                            <Users className="h-3.5 w-3.5" />
                            {cat.registered_count}/{cat.capacity || '∞'} đã đăng ký
                          </div>
                          {cat.capacity && cat.registered_count >= cat.capacity && (
                            <Badge className="td-categories__full">Hết chỗ</Badge>
                          )}
                        </FadeIn>
                      ))}
                    </FadeInStagger>
                  </div>
                )}

                {/* ─── Description ─── */}
                <CollapsibleDescription description={tournament.description} />

                {/* ─── Leaderboard ─── */}
                {results && results.length > 0 && (
                  <div className="td-leaderboard">
                    <h3 className="td-section-title">
                      <Medal className="h-5 w-5 text-[#FC4C02]" />
                      Bảng xếp hạng (Top 10)
                    </h3>
                    <FadeIn className="td-leaderboard__table-wrap">
                      <table className="td-leaderboard__table">
                        <thead>
                          <tr>
                            <th className="td-leaderboard__th td-leaderboard__th--rank">Hạng</th>
                            <th className="td-leaderboard__th td-leaderboard__th--name">Vận động viên</th>
                            <th className="td-leaderboard__th td-leaderboard__th--dist">Quãng đường</th>
                            <th className="td-leaderboard__th td-leaderboard__th--time">Thời gian</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((r: any, idx: number) => {
                            const isTop3 = idx < 3;
                            const colors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];
                            return (
                              <tr key={r.id} className="td-leaderboard__row">
                                <td className="td-leaderboard__td td-leaderboard__td--rank">
                                  {isTop3 ? (
                                    <span className={colors[idx]}><Medal className="h-5 w-5 inline-block" /></span>
                                  ) : (
                                    idx + 1
                                  )}
                                </td>
                                <td className="td-leaderboard__td td-leaderboard__td--name">
                                  <div className="td-leaderboard__athlete">
                                    <div className="td-leaderboard__avatar">
                                      {r.profiles?.avatar_url ? (
                                        <img src={r.profiles.avatar_url} className="td-leaderboard__avatar-img" alt="" />
                                      ) : (
                                        <span className="td-leaderboard__avatar-text">
                                          {r.profiles?.full_name?.charAt(0) || '?'}
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="td-leaderboard__name">{r.profiles?.full_name || 'VĐV Ẩn danh'}</p>
                                      {r.category?.name && (
                                        <p className="td-leaderboard__category">{r.category.name}</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="td-leaderboard__td td-leaderboard__td--dist">
                                  <span className="td-leaderboard__distance">{(r.total_distance / 1000).toFixed(2)}</span>
                                  <span className="td-leaderboard__unit">km</span>
                                </td>
                                <td className="td-leaderboard__td td-leaderboard__td--time">
                                  {Math.floor(r.total_moving_time / 3600)}:{String(Math.floor((r.total_moving_time % 3600) / 60)).padStart(2, '0')}:{String(r.total_moving_time % 60).padStart(2, '0')}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </FadeIn>
                  </div>
                )}
              </FadeIn>
            </div>

            {/* ─── Right Sidebar ─── */}
            <div className="td-sidebar">
              {/* Countdown + CTA */}
              <FadeIn delay={0.3} className="td-sidebar__cta">
                {tournament.registration_close_at ? (
                  <CountdownTimer
                    targetDate={tournament.registration_close_at}
                    label="Thời gian đăng ký còn"
                  />
                ) : tournament.start_date ? (
                  <CountdownTimer
                    targetDate={tournament.start_date}
                    label="Giải đấu bắt đầu sau"
                  />
                ) : null}

                <div className="td-sidebar__fee">
                  <span className="td-sidebar__fee-amount">{feeDisplay}</span>
                </div>

                <div className="td-sidebar__cta-actions">
                  {regOpen && !regNotYetOpen ? (
                    <Link href={`/giai-dau/${slug}/dang-ky`} className="block">
                      <Button size="lg" className="td-sidebar__register-btn">
                        <UserPlus className="h-5 w-5" />
                        Đăng ký ngay
                      </Button>
                    </Link>
                  ) : regNotYetOpen ? (
                    <Button size="lg" className="td-sidebar__register-btn" disabled>
                      <Clock className="h-5 w-5" /> Chưa mở đăng ký
                    </Button>
                  ) : (
                    <Button size="lg" className="td-sidebar__register-btn" disabled>
                      Đã hết hạn đăng ký
                    </Button>
                  )}
                </div>

                <div className="td-sidebar__participants">
                  <div className="td-sidebar__participant-avatars">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="td-sidebar__participant-avatar">
                        <UserPlus className="h-3 w-3" />
                      </div>
                    ))}
                  </div>
                  <span className="td-sidebar__participant-count">
                    <strong>{tournament.participant_count}</strong> người tham gia
                  </span>
                  <button className="td-sidebar__share-btn">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </FadeIn>

              {/* Facebook Fanpage */}
              {tournament.facebook_page_url && (
                <FadeIn delay={0.4}>
                  <FacebookEmbed
                    pageUrl={tournament.facebook_page_url}
                    pageName={tournament.facebook_page_name || "TOPACTION"}
                  />
                </FadeIn>
              )}

              {/* Tournament Info */}
              {tournament.description && (
                <FadeIn delay={0.5} className="td-sidebar__info">
                  <h3 className="td-sidebar__info-title">Thông tin giải đấu</h3>
                  <p className="td-sidebar__info-text">
                    {tournament.short_description || tournament.description?.substring(0, 200)}
                  </p>
                </FadeIn>
              )}

              {/* Donation Widget */}
              <FadeIn delay={0.6}>
                <DonationWidget
                  tournamentId={tournament.id}
                  slug={slug}
                  initialDonations={donationList}
                  initialTotal={tournament.donation_total || 0}
                />
              </FadeIn>
            </div>
          </div>

          {/* ─── Organizers Section (Full Width) ─── */}
          {(organizers.length > 0 || sponsors.length > 0 || partners.length > 0) && (
            <div className="td-organizers">
              {organizers.length > 0 && (
                <FadeIn className="td-organizers__section">
                  <h3 className="td-organizers__title">
                    <Building2 className="td-organizers__title-icon" />
                    Đơn vị tổ chức
                  </h3>
                  <div className="td-organizers__logos">
                    {organizers.map((org: any) => (
                      <div key={org.id} className="td-organizers__logo-card">
                        {org.logo_url ? (
                          <img src={org.logo_url} alt={org.name} className="td-organizers__logo-img" />
                        ) : (
                          <div className="td-organizers__logo-placeholder">
                            <Building2 className="h-8 w-8" />
                            <span>{org.name}</span>
                          </div>
                        )}
                        {org.description && (
                          <p className="td-organizers__logo-desc">{org.description}</p>
                        )}
                      </div>
                    ))}
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
                    {sponsors.map((sp: any) => (
                      <div key={sp.id} className="td-organizers__logo-card">
                        {sp.logo_url ? (
                          <img src={sp.logo_url} alt={sp.name} className="td-organizers__logo-img" />
                        ) : (
                          <div className="td-organizers__logo-placeholder">
                            <Star className="h-8 w-8" />
                            <span>{sp.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </FadeIn>
              )}

              {partners.length > 0 && (
                <FadeIn className="td-organizers__section">
                  <h3 className="td-organizers__title">
                    <Handshake className="td-organizers__title-icon" />
                    Đơn vị đồng hành
                  </h3>
                  <div className="td-organizers__logos">
                    {partners.map((pt: any) => (
                      <div key={pt.id} className="td-organizers__logo-card">
                        {pt.logo_url ? (
                          <img src={pt.logo_url} alt={pt.name} className="td-organizers__logo-img" />
                        ) : (
                          <div className="td-organizers__logo-placeholder">
                            <Handshake className="h-8 w-8" />
                            <span>{pt.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </FadeIn>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Trophy className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold">TOPACTION</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 TOPACTION. Nền tảng giải đấu thể thao trực tuyến.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
