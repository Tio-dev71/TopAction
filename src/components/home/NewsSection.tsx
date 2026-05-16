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

        <FadeInStagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <FadeIn key={post.slug}>
              <Link
                href={`/tin-tuc/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="relative overflow-hidden rounded-t-[2rem] bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.92))] p-4">
                  <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between">
                    <Badge className="border-0 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-sm">
                      Bài viết mới
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
                  <h3 className="mt-3 line-clamp-2 text-[1.7rem] font-extrabold leading-tight tracking-tight text-card-foreground transition-colors group-hover:text-primary sm:text-[1.9rem]">
                    {post.title}
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Xem chi tiết
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
