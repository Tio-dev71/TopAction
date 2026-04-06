import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "ATUAN - Nền tảng giải đấu thể thao trực tuyến",
  description:
    "Khám phá và tham gia các giải đấu thể thao hàng đầu Việt Nam. Đăng ký, theo dõi bảng xếp hạng, và ủng hộ vận động viên.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
          {children}
          <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
