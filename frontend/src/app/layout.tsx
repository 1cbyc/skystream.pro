import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import SocialDock from "@/components/SocialDock";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkyStream.pro",
  description: "Unified NASA-powered Space Intelligence Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} safe-top safe-right safe-bottom safe-left`}>
        {children}
        <SiteFooter />
        <SocialDock />
      </body>
    </html>
  );
}
