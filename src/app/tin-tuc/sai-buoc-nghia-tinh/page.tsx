import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations/MotionWrapper";

export const metadata: Metadata = {
  title: "Sải bước nghĩa tình - 65 năm chung tay xoa dịu nỗi đau da cam",
  description: "Chiến dịch cộng đồng vì nạn nhân chất độc da cam/dioxin Việt Nam. Hành trình 65 năm thảm họa da cam.",
};

export default function CanvaLandingPage() {
  return (
    <div className="flex h-screen w-full flex-col bg-slate-50">
      {/* Minimal Header */}
      <header className="absolute left-0 top-0 z-50 flex w-full items-center justify-between p-4 sm:p-6 lg:px-8">
        <FadeIn>
          <Link
            href="/tin-tuc"
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition-all hover:bg-white hover:text-primary hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại tin tức
          </Link>
        </FadeIn>
      </header>

      {/* Full Screen Canva Embed */}
      <main className="flex-1">
        <div
          className="relative h-full w-full overflow-hidden"
          style={{ paddingTop: "0%" /* No ratio needed, use full h-screen */ }}
        >
          <iframe
            loading="lazy"
            className="absolute left-0 top-0 h-full w-full border-none"
            src="https://www.canva.com/design/DAHJ8UjgQmg/8tRYGxj_qaELKP00WCsIBQ/view?embed"
            allowFullScreen
            allow="fullscreen"
          ></iframe>
        </div>
      </main>
    </div>
  );
}
