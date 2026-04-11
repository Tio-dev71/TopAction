import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Be_Vietnam_Pro } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TOPACTION - Nền tảng giải đấu thể thao trực tuyến",
  description:
    "Khám phá và tham gia các giải đấu thể thao hàng đầu Việt Nam. Đăng ký, theo dõi bảng xếp hạng, và ủng hộ vận động viên.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`h-full antialiased ${beVietnamPro.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
