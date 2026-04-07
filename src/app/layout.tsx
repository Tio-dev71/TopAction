import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
    <html lang="vi" className="h-full antialiased font-sans" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
