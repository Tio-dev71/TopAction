import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { FadeIn, FadeInStagger } from "@/components/animations/MotionWrapper";

export const metadata: Metadata = {
  title: "Báo chí | TOPPLAY",
  description: "Cập nhật các bài viết, thông báo và tin tức mới nhất từ TOPPLAY.",
  openGraph: {
    title: "Báo chí | TOPPLAY",
    description: "Cập nhật các bài viết, thông báo và tin tức mới nhất từ TOPPLAY.",
    url: "https://topplay.vn/tin-tuc",
    siteName: "TOPPLAY",
    locale: "vi_VN",
    type: "website",
  },
};

function formatDate(iso: string | null) {
  if (!iso) return "Mới cập nhật";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getPreview(source: string | null, fallback: string | null) {
  return (source || fallback || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 190);
}

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("slug, title, excerpt, content, cover_image, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 sm:py-24 lg:px-8">
            <FadeIn className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Newspaper className="h-3.5 w-3.5" />
                Báo chí TOPPLAY
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Bài viết và thông báo
                <span className="block text-primary">mới nhất</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Theo dõi các cập nhật mới nhất về giải đấu, cộng đồng thể thao và những chiến dịch nổi bật từ TOPPLAY.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!posts?.length ? (
              <div className="rounded-[2rem] border border-dashed border-border/60 bg-card px-6 py-16 text-center">
                <Newspaper className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">Chưa có bài viết nào được xuất bản.</p>
              </div>
            ) : (
              <FadeInStagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <FadeIn key={post.slug}>
                    <Link
                      href={`/tin-tuc/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                    >
                      <div className="relative overflow-hidden rounded-t-[2rem] bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.92))] p-4">
                        <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between">
                          <Badge className="border-0 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-sm">
                            Bài viết
                          </Badge>
                          <div className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-sm">
                            TOPPLAY
                          </div>
                        </div>

                        <div className="flex min-h-[220px] items-center justify-center rounded-[1.5rem] bg-white/90 pt-10 shadow-inner ring-1 ring-black/5">
                          {post.cover_image ? (
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="max-h-[200px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-[180px] w-full items-center justify-center rounded-[1.25rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_45%),linear-gradient(135deg,rgba(79,70,229,0.16),rgba(14,165,233,0.14))]">
                              <Newspaper className="h-12 w-12 text-primary/80" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                          {formatDate(post.published_at)}
                        </div>
                        <h2 className="mt-3 line-clamp-2 text-[1.45rem] font-extrabold leading-tight tracking-tight text-card-foreground transition-colors group-hover:text-primary sm:text-[1.6rem]">
                          {post.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
                          {getPreview(post.excerpt, post.content)}
                          {getPreview(post.excerpt, post.content) ? "..." : ""}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          Đọc bài viết
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </FadeInStagger>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
