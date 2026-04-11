"use client";

interface FacebookEmbedProps {
  pageUrl: string;
  pageName?: string;
}

export function FacebookEmbed({ pageUrl }: FacebookEmbedProps) {
  if (!pageUrl) return null;

  const encodedUrl = encodeURIComponent(pageUrl);

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
