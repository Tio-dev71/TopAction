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
} from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

/* ────────────── helpers ────────────── */

function fmtDate(iso: string | null) {
  if (!iso) return "TBD";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

const ruleIcons: Record<string, React.ReactNode> = {
  running: <Dumbbell className="h-6 w-6" />,
  gauge: <Gauge className="h-6 w-6" />,
  map: <Map className="h-6 w-6" />,
  smartphone: <Smartphone className="h-6 w-6" />,
  "check-circle": <CheckCircle className="h-6 w-6" />,
  sport: <Trophy className="h-6 w-6" />,
  pace: <Gauge className="h-6 w-6" />,
};

/* ────────────── page ────────────── */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: t } = await supabase.from('tournaments').select('title, short_description').eq('slug', slug).single();
  return {
    title: t ? `${t.title} | TOPACTION` : 'Giải đấu | TOPACTION',
    description: t?.short_description || 'Thông tin giải đấu thể thao trực tuyến',
  };
}

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

  // Check registration window
  const now = new Date().toISOString();
  const regOpen = !tournament.registration_close_at || now < tournament.registration_close_at;
  const regNotYetOpen = tournament.registration_open_at && now < tournament.registration_open_at;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            {tournament.cover_image ? (
              <img src={tournament.cover_image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pt-32 lg:px-8">
            <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Trang chủ
            </Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                {tournament.category && (
                  <Badge variant="secondary" className="mb-3">{tournament.category}</Badge>
                )}
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {tournament.title}
                </h1>
                {tournament.short_description && (
                  <p className="mt-3 text-lg text-muted-foreground">{tournament.short_description}</p>
                )}

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {fmtDate(tournament.start_date)} – {fmtDate(tournament.end_date)}
                  </div>
                  {tournament.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {tournament.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <strong className="text-foreground">{tournament.participant_count}</strong>
                    {tournament.max_participants && `/${tournament.max_participants}`} tham gia
                  </div>
                </div>
              </div>

              {/* Countdown + CTA */}
              <div className="rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm shadow-lg sm:min-w-[280px]">
                {tournament.start_date && (
                  <CountdownTimer targetDate={tournament.start_date} />
                )}
                <div className="mt-4 space-y-2">
                  {regOpen && !regNotYetOpen ? (
                    <Link href={`/giai-dau/${slug}/dang-ky`} className="block">
                      <Button size="lg" className="w-full gap-2 text-base">
                        <UserPlus className="h-5 w-5" />
                        Đăng ký ngay
                      </Button>
                    </Link>
                  ) : regNotYetOpen ? (
                    <Button size="lg" className="w-full" disabled>
                      <Clock className="mr-2 h-5 w-5" /> Chưa mở đăng ký
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full" disabled>
                      Đã hết hạn đăng ký
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-8 lg:col-span-2">
              {/* Categories */}
              {tournament.categories && tournament.categories.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Hạng mục thi đấu
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {tournament.categories.map((cat: any) => (
                      <div key={cat.id} className="rounded-xl border border-border/60 bg-card p-4 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold">{cat.name}</h3>
                          <Badge variant="outline" className="text-primary">
                            {cat.price > 0 ? `${cat.price.toLocaleString('vi-VN')} ₫` : 'Miễn phí'}
                          </Badge>
                        </div>
                        {cat.distance && (
                          <p className="mt-1 text-sm text-muted-foreground">Cự ly: {cat.distance}</p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {cat.registered_count}/{cat.capacity || '∞'} đã đăng ký
                        </div>
                        {cat.capacity && cat.registered_count >= cat.capacity && (
                          <Badge className="mt-2 bg-red-100 text-red-600 border-0">Hết chỗ</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Description */}
              {tournament.description && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Giới thiệu giải đấu</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {tournament.description}
                  </div>
                </section>
              )}

              {/* Rules */}
              {tournament.rules && tournament.rules.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Quy định sự kiện</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {tournament.rules.map((rule: any) => (
                      <div key={rule.id} className="rounded-xl border border-border/60 bg-card p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            {ruleIcons[rule.icon || rule.rule_type || ''] || <CheckCircle className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{rule.title}</h3>
                            {rule.content && (
                              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{rule.content}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Organizers */}
              {tournament.organizers && tournament.organizers.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Đơn vị tổ chức & Đồng hành</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {tournament.organizers.map((org: any) => {
                      const typeIcons: Record<string, React.ReactNode> = {
                        organizer: <Building2 className="h-5 w-5" />,
                        sponsor: <Star className="h-5 w-5" />,
                        partner: <Handshake className="h-5 w-5" />,
                      };
                      const typeLabels: Record<string, string> = {
                        organizer: 'Tổ chức',
                        sponsor: 'Tài trợ',
                        partner: 'Đồng hành',
                      };
                      return (
                        <div key={org.id} className="rounded-xl border border-border/60 bg-card p-4">
                          <div className="flex items-center gap-3">
                            {org.logo_url ? (
                              <img src={org.logo_url} alt={org.name} className="h-12 w-12 rounded-lg object-cover" />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                {typeIcons[org.type] || <Building2 className="h-5 w-5" />}
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-sm">{org.name}</h3>
                              <p className="text-xs text-muted-foreground">{typeLabels[org.type] || org.type}</p>
                              {org.description && (
                                <p className="mt-1 text-xs text-muted-foreground">{org.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Register CTA */}
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  Tham gia giải đấu
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  {regOpen && !regNotYetOpen
                    ? 'Đăng ký ngay để giữ chỗ và nhận ưu đãi sớm!'
                    : regNotYetOpen
                      ? 'Đăng ký sẽ mở sớm. Hãy theo dõi!'
                      : 'Đã hết hạn đăng ký cho giải đấu này.'}
                </p>
                {regOpen && !regNotYetOpen ? (
                  <Link href={`/giai-dau/${slug}/dang-ky`} className="mt-3 block">
                    <Button className="w-full gap-2">
                      <UserPlus className="h-4 w-4" /> Đăng ký ngay
                    </Button>
                  </Link>
                ) : (
                  <Button className="mt-3 w-full" disabled>
                    {regNotYetOpen ? 'Chưa mở' : 'Đã đóng'}
                  </Button>
                )}
              </div>

              {/* Donation Widget */}
              <DonationWidget
                tournamentId={tournament.id}
                slug={slug}
                initialDonations={donationList}
                initialTotal={tournament.donation_total || 0}
              />
            </div>
          </div>
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
