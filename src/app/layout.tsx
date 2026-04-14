import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SkyStream.pro | NASA Mission Control",
  description:
    "A rebuilt full-stack NASA exploration platform spanning APOD, asteroids, Mars, Earth observation, solar weather, media archives, and exoplanets.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#040712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} min-h-screen bg-[#040712] font-body text-slate-100 antialiased`}
      >
        <div className="site-shell">
          <AppHeader />
          <main>{children}</main>
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
