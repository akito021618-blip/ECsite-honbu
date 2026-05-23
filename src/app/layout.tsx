import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "自然の恵み | プレミアム会員制オーガニックショップ",
    template: "%s | 自然の恵み",
  },
  description:
    "厳選された有機食品と環境に優しい日用品をお届けする、プレミアム会員制オンラインショップ。月額600円で上質な日本の自然食品を。",
  keywords: ["有機食品", "オーガニック", "エコ", "日本産", "プレミアム", "会員制"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "自然の恵み",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${notoSansJP.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-cream">
        <SessionProvider session={session}>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
