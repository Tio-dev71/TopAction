"use client";

import { ExternalLink } from "lucide-react";

interface FacebookEmbedProps {
  pageUrl: string;
  pageName?: string;
}

function isUnsupportedFacebookPluginUrl(url: string) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();

    return (
      path.startsWith("/share/") ||
      path.startsWith("/groups/") ||
      path.startsWith("/profile.php") ||
      /^\/\d+\/?$/.test(path)
    );
  } catch {
    return true;
  }
}

export function FacebookEmbed({ pageUrl, pageName = "Facebook" }: FacebookEmbedProps) {
  if (!pageUrl) return null;

  const encodedUrl = encodeURIComponent(pageUrl);
  const unsupportedPluginUrl = isUnsupportedFacebookPluginUrl(pageUrl);

  if (unsupportedPluginUrl) {
    return (
      <div className="w-full rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-indigo-50 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow-lg shadow-blue-500/20">
            <span className="text-2xl font-black leading-none">f</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Facebook
            </p>
            <h3 className="mt-1 truncate text-lg font-bold text-slate-950">
              {pageName || "Cộng đồng Facebook"}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Link này là nhóm/chia sẻ/profile nên Facebook không cho nhúng bằng Page Plugin.
              Bấm nút bên dưới để mở trực tiếp trên Facebook.
            </p>
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#0f66d8]"
            >
              Mở trên Facebook
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center bg-white border border-border/60 rounded-xl overflow-hidden shadow-sm">
      <iframe
        src={`https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`}
        width="340"
        height="130"
        style={{ border: "none", overflow: "hidden", width: "100%", maxWidth: "340px", backgroundColor: "white" }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
}
