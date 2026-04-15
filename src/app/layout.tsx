import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://topplay.vn'),
  title: "TOPPLAY - Nền tảng giải đấu thể thao trực tuyến",
  description:
    "Khám phá và tham gia các giải đấu thể thao hàng đầu Việt Nam. Đăng ký, theo dõi bảng xếp hạng, và ủng hộ vận động viên.",
  openGraph: {
    title: "TOPPLAY - Nền tảng giải đấu thể thao trực tuyến",
    description: "Khám phá và tham gia các giải đấu thể thao hàng đầu Việt Nam.",
    url: 'https://topplay.vn',
    siteName: 'TOPPLAY',
    images: [
      {
        url: 'https://topplay.vn/images/default-share.jpg',
        width: 1200,
        height: 630,
        alt: 'TOPPLAY',
      }
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TOPPLAY - Nền tảng giải đấu thể thao trực tuyến",
    description: "Khám phá và tham gia các giải đấu thể thao hàng đầu Việt Nam.",
    images: ['https://topplay.vn/images/default-share.jpg'],
  },
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
      </body>
    </html>
  );
}
