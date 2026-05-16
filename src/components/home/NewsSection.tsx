import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FadeIn, FadeInStagger } from "@/components/animations/MotionWrapper";

interface NewsSectionProps {
  posts: Array<{
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    cover_image: string | null;
    published_at: string | null;
  }>;
}

function formatDate(iso: string | null) {
  if (!iso) return "Mới cập nhật";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getPreview(post: NewsSectionProps["posts"][number]) {
  const source = (post.excerpt || post.content || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return source.slice(0, 180);
}

export function NewsSection({ posts }: NewsSectionProps) {
  if (!posts.length) return null;

  return (
    <section id="news" className="relative py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-10 h-[280px] w-[280px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <Newspaper className="h-4 w-4" />
              Tin tức nổi bật
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Cập nhật mới nhất từ <span className="text-primary">TOPPLAY</span>
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Tin tức, thông báo và bài viết nổi bật được cập nhật trực tiếp từ trang quản trị bài viết.
            </p>
          </div>
        </div>

        <FadeInStagger className="grid gap-6 lg:grid-cols-3">
          {posts.slice(0, 1).map((post) => (
            <FadeIn key={post.slug} className="lg:col-span-2">
              <Link
                href={`/tin-tuc/${post.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-[0_18px_60px_rgba(78,99,255,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(78,99,255,0.2)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary/30">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full min-h-[220px] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_45%),linear-gradient(135deg,rgba(79,70,229,0.16),rgba(14,165,233,0.14))]">
                      <div className="rounded-3xl border border-border/60 bg-background/80 p-5 shadow-lg backdrop-blur-md">
                        <Newspaper className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <Badge className="border-0 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-sm">
                      Bài viết mới
                    </Badge>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(post.published_at)}
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold leading-tight tracking-tight text-card-foreground sm:text-2xl">
                    {post.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
                    {getPreview(post)}{getPreview(post) ? "..." : ""}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Xem thêm
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {posts.slice(1, 3).map((post) => (
              <FadeIn key={post.slug}>
                <Link
                  href={`/tin-tuc/${post.slug}`}
                  className="group flex h-full gap-4 overflow-hidden rounded-[1.75rem] border border-border/60 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 sm:p-5"
                >
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-secondary/40 sm:h-32 sm:w-32">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-primary/8">
                        <Newspaper className="h-8 w-8 text-primary/70" />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                        {formatDate(post.published_at)}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-card-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {getPreview(post)}{getPreview(post) ? "..." : ""}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Xem thêm
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
      </div>
    </section>
  );
}
