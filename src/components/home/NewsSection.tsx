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
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-secondary/30">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Newspaper className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-xs font-semibold text-foreground backdrop-blur-sm">
                      Tin tức
                    </Badge>
                  </div>
                  
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    <Badge className="gap-1 bg-primary/90 text-white backdrop-blur-sm border-0">
                      TOPPLAY
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="text-base font-bold leading-snug tracking-tight text-card-foreground group-hover:text-primary transition-colors sm:text-lg line-clamp-2 min-h-[3rem]">
                    {post.title}
                  </h3>

                  <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0 text-primary/60" />
                      <span>{formatDate(post.published_at)}</span>
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
            </FadeIn>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
