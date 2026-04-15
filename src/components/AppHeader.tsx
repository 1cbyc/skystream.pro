"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Mission Control" },
  { href: "/mood", label: "APOD" },
  { href: "/impact", label: "Asteroids" },
  { href: "/mars", label: "Mars" },
  { href: "/earth", label: "Earth" },
  { href: "/space-weather", label: "Solar Weather" },
  { href: "/library", label: "Media Library" },
  { href: "/exoplanets", label: "Exoplanets" },
  { href: "/capsule", label: "Capsule" },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(5,8,20,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-100">
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className="h-7 w-7"
                fill="none"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="8"
                  className="fill-cyan-200/90"
                />
                <ellipse
                  cx="24"
                  cy="24"
                  rx="17"
                  ry="7"
                  className="stroke-cyan-300"
                  strokeWidth="2.2"
                />
                <path
                  d="M16 12c2.8 1.4 5.5 2.1 8 2.1 4.5 0 8.8-2.1 12.9-6.1"
                  className="stroke-cyan-100/80"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
                <circle cx="35.5" cy="15.5" r="1.8" className="fill-white" />
              </svg>
            </div>
            <div>
              <p className="font-display text-xl tracking-[0.16em] text-white">
                SkyStream
              </p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                by Nsisong
              </p>
            </div>
          </Link>

          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300 md:block">
            Space in one place
          </div>
        </div>

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
