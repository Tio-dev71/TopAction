"use client";

import { ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";

interface FacebookEmbedProps {
  pageUrl: string;
  pageName: string;
}

export function FacebookEmbed({ pageUrl, pageName }: FacebookEmbedProps) {
  if (!pageUrl) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: pageName, url: pageUrl });
    } else {
      navigator.clipboard.writeText(pageUrl);
      toast.success("Đã sao chép link fanpage!");
    }
  };

  return (
    <div className="fb-embed">
      <div className="fb-embed__header">
        {/* Facebook icon */}
        <div className="fb-embed__logo">
          <svg viewBox="0 0 24 24" fill="currentColor" className="fb-embed__fb-icon">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
        <div className="fb-embed__info">
          <p className="fb-embed__name">{pageName}</p>
        </div>
      </div>

      <div className="fb-embed__actions">
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fb-embed__btn fb-embed__btn--follow"
        >
          <ExternalLink className="fb-embed__btn-icon" />
          Theo dõi Trang
        </a>
        <button
          onClick={handleShare}
          className="fb-embed__btn fb-embed__btn--share"
        >
          <Share2 className="fb-embed__btn-icon" />
          Chia sẻ
        </button>
      </div>
    </div>
  );
}
