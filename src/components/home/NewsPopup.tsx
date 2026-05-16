"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NewsPopupProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    cover_image: string | null;
    published_at: string | null;
  } | null;
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string | null) {
  if (!iso) return "Mới cập nhật";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function NewsPopup({ post }: NewsPopupProps) {
  const [open, setOpen] = useState(false);

  const preview = useMemo(() => {
    if (!post) return "";
    const source = post.excerpt || post.content || "";
    return stripHtml(source).slice(0, 220);
  }, [post]);

  useEffect(() => {
    if (!post) return;

    const storageKey = `topplay-news-popup:${post.slug}`;
    const dismissed = window.sessionStorage.getItem(storageKey);

    if (!dismissed) {
      const timer = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, [post]);

  if (!post || !open) return null;

  const storageKey = `topplay-news-popup:${post.slug}`;

  const closePopup = () => {
    window.sessionStorage.setItem(storageKey, "dismissed");
    setOpen(false);
  };

  return (
    <div
      id="homepage-news-popup"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md sm:items-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="homepage-news-popup-title"
    >
      <div className="relative w-full max-w-[22.5rem] overflow-hidden rounded-[1.5rem] border border-white/15 bg-[linear-gradient(145deg,rgba(18,24,45,0.96),rgba(42,24,78,0.96))] text-white shadow-[0_30px_120px_rgba(31,38,135,0.45)] sm:max-w-3xl sm:rounded-[2rem]">
        <button
          id="homepage-news-popup-close"
          type="button"
          onClick={closePopup}
          className="absolute right-2.5 top-2.5 z-10 inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/20 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
          aria-label="Đóng tin tức"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[150px] bg-slate-900/40 sm:min-h-[220px] md:min-h-[260px]">
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[150px] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.28),transparent_48%),linear-gradient(135deg,rgba(99,102,241,0.85),rgba(91,33,182,0.92))] sm:min-h-[220px] md:min-h-[260px]">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md sm:rounded-3xl sm:p-5">
                  <Newspaper className="h-9 w-9 text-white sm:h-14 sm:w-14" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
            <div className="absolute left-3.5 top-3.5 sm:left-5 sm:top-5">
              <Badge className="border-0 bg-white/15 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:px-3 sm:text-[11px] sm:tracking-[0.24em]">
                <Sparkles className="h-3 w-3" />
                Tin mới
              </Badge>
            </div>
          </div>

          <div className="flex flex-col justify-between p-3.5 sm:p-6 md:p-8">
            <div>
              <p className="text-[11px] font-medium text-cyan-200/90 sm:text-sm">Cập nhật ngày {formatDate(post.published_at)}</p>
              <h2
                id="homepage-news-popup-title"
                className="mt-2 text-[1.15rem] font-extrabold leading-tight tracking-tight text-white sm:mt-3 sm:text-[1.7rem] md:text-[2rem]"
              >
                {post.title}
              </h2>
              <p className="mt-2.5 line-clamp-4 text-[12px] leading-5.5 text-slate-200/88 sm:mt-4 sm:text-sm sm:leading-7 md:text-[15px]">
                {preview || "Nội dung bài viết sẽ được cập nhật trong ít phút tới."}
                {preview ? "..." : ""}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:mt-8 sm:gap-3 sm:flex-row">
              <Link href={`/tin-tuc/${post.slug}`} onClick={closePopup}>
                <Button
                  id="homepage-news-popup-readmore"
                  size="lg"
                  className={cn(
                    "h-10 w-full gap-2 rounded-full border-0 bg-white px-4 text-[13px] text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-50 sm:h-12 sm:w-auto sm:px-5 sm:text-sm"
                  )}
                >
                  Xem chi tiết
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                id="homepage-news-popup-later"
                type="button"
                variant="outline"
                size="lg"
                onClick={closePopup}
                className="h-10 rounded-full border-white/20 bg-white/5 px-4 text-[13px] text-white hover:bg-white/10 hover:text-white sm:h-12 sm:px-5 sm:text-sm"
              >
                Để sau
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
