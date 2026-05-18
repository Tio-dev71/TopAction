import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Newspaper, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { FadeIn, FadeInStagger } from "@/components/animations/MotionWrapper";

function stripHtml(input: string | null) {
  return (input || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string | null) {
  if (!iso) return "Mới cập nhật";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPostContent(content: string | null, fallback: string | null) {
  const source = (content || fallback || "Nội dung đang được cập nhật.").trim();

  if (/<\/?[a-z][\s\S]*>/i.test(source)) {
    return source;
  }

  return source
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, content, cover_image, slug, status")
    .eq("slug", slug)
    .single();

  const title = post?.title ? `${post.title} | TOPPLAY` : "Tin tức | TOPPLAY";
  const description = stripHtml(post?.excerpt || post?.content || "Tin tức mới nhất từ TOPPLAY").slice(0, 160);
  const image = post?.cover_image || "https://topplay.vn/images/default-share.jpg";
  const url = `https://topplay.vn/tin-tuc/${post?.slug || slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "TOPPLAY",
      locale: "vi_VN",
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content, cover_image, canva_embed_url, story_image_urls, published_at, status")
    .eq("slug", slug)
    .single();

  if (!post || post.status !== "published") {
    notFound();
  }

  const storyImages = Array.isArray(post.story_image_urls) ? post.story_image_urls.filter(Boolean) : [];

  // ── Vertical Story Image Mode ─────────────────────────────────────────────
  if (storyImages.length > 0) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_40%),linear-gradient(180deg,#020617_0%,#0b1120_100%)]">
        <header className="sticky top-0 z-50 flex w-full items-center border-b border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md sm:px-6">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại tin tức
          </Link>
        </header>

        <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
          <h1 className="mb-5 text-center text-xl font-extrabold text-white sm:text-2xl">{post.title}</h1>
          <div className="space-y-4">
            {storyImages.map((src, idx) => (
              <div key={`${src}-${idx}`} className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-[0_12px_40px_rgba(2,6,23,0.45)]">
                <img
                  src={src}
                  alt={`${post.title} - trang ${idx + 1}`}
                  className="w-full h-auto object-contain"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ── Canva Landing Page Mode (Portrait / Vertical-friendly) ───────────────
  if (post.canva_embed_url) {
    return (
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_40%),linear-gradient(180deg,#020617_0%,#0b1120_100%)]">
        <header className="sticky top-0 z-50 flex w-full items-center border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md sm:px-6">
          <FadeIn>
            <Link
              href="/tin-tuc"
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại tin tức
            </Link>
          </FadeIn>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <FadeIn>
            <div className="mb-5 text-center">
              <h1 className="text-balance text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                {post.title}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Chế độ xem dọc - tối ưu trải nghiệm trên điện thoại
              </p>
            </div>
          </FadeIn>

          {/* Portrait container */}
          <FadeIn>
            <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/15 bg-black/30 p-2 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[22px] bg-black">
                <iframe
                  src={post.canva_embed_url}
                  className="absolute inset-0 h-full w-full border-none"
                  allowFullScreen
                  allow="fullscreen"
                  loading="eager"
                  title={post.title}
                />
              </div>
            </div>
          </FadeIn>
        </main>
      </div>
    );
  }

  // ── Standard Article Mode ────────────────────────────────────────────────
  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("slug, title, excerpt, cover_image, published_at")
    .eq("status", "published")
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <FadeIn>
              <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Quay lại tin tức
              </Link>
            </FadeIn>

            <FadeIn className="mt-6">
              <Badge className="border-0 bg-primary/10 text-primary shadow-none">
                <Newspaper className="h-3.5 w-3.5" />
                Tin tức TOPPLAY
              </Badge>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                {formatDate(post.published_at)}
              </div>
              {post.excerpt && (
                <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {post.excerpt}
                </p>
              )}
            </FadeIn>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
            <FadeIn className="min-w-0">
              <article className="overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
                {post.cover_image && (
                  <div className="border-b border-border/60 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.94))] p-5 sm:p-6">
                    <div className="overflow-hidden rounded-[1.5rem] bg-white/90 p-4 shadow-inner ring-1 ring-black/5">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="mx-auto max-h-[460px] w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-8 lg:p-10">
                  <div
                    className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-p:leading-8 prose-p:text-slate-700 prose-strong:text-slate-900 prose-img:rounded-2xl prose-a:text-primary prose-li:leading-8"
                    dangerouslySetInnerHTML={{ __html: formatPostContent(post.content, post.excerpt) }}
                  />
                </div>
              </article>
            </FadeIn>

            <aside className="space-y-6">
              <FadeIn>
                <div className="rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-sm">
                  <h2 className="text-lg font-extrabold tracking-tight">Khám phá thêm</h2>
                  <div className="mt-4 space-y-3">
                    <Link href="/giai-dau" className="flex items-center justify-between rounded-2xl border border-border/60 bg-secondary/20 px-4 py-3 text-sm font-semibold transition-colors hover:border-primary/30 hover:text-primary">
                      Giải đấu đang mở
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/tin-tuc" className="flex items-center justify-between rounded-2xl border border-border/60 bg-secondary/20 px-4 py-3 text-sm font-semibold transition-colors hover:border-primary/30 hover:text-primary">
                      Tất cả tin tức
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </FadeIn>

              {!!relatedPosts?.length && (
                <FadeIn>
                  <div className="rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-sm">
                    <h2 className="text-lg font-extrabold tracking-tight">Bài viết liên quan</h2>
                    <FadeInStagger className="mt-4 space-y-4">
                      {relatedPosts.map((item) => (
                        <FadeIn key={item.slug}>
                          <Link href={`/tin-tuc/${item.slug}`} className="group block rounded-2xl border border-border/60 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                            <div className="flex gap-3">
                              <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.92))] p-2 ring-1 ring-black/5">
                                {item.cover_image ? (
                                  <img src={item.cover_image} alt={item.title} className="max-h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-primary/8">
                                    <Newspaper className="h-5 w-5 text-primary/70" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/75">
                                  {formatDate(item.published_at)}
                                </p>
                                <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-6 transition-colors group-hover:text-primary">
                                  {item.title}
                                </h3>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                  {stripHtml(item.excerpt || "").slice(0, 80)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </FadeIn>
                      ))}
                    </FadeInStagger>
                  </div>
                </FadeIn>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
