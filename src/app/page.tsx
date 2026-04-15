"use client";

import useSWR from "swr";
import DataState from "@/components/DataState";
import MissionCard from "@/components/MissionCard";
import { fetcher } from "@/lib/fetcher";
import type { DashboardPayload } from "@/lib/nasa";

const missionCards = [
  {
    href: "/mood",
    eyebrow: "Daily signal",
    title: "APOD Intelligence",
    description:
      "Turn the Astronomy Picture of the Day into a living editorial object with context, copyright, and a sharper visual stage.",
  },
  {
    href: "/impact",
    eyebrow: "Risk layer",
    title: "Asteroid Watch",
    description:
      "Read NASA NeoWs with better filtering, hazard emphasis, and cleaner orbital storytelling.",
  },
  {
    href: "/mars",
    eyebrow: "Surface feed",
    title: "Mars Rover Deck",
    description:
      "Browse rover manifests and high-quality captures from Curiosity, Perseverance, Opportunity, and Spirit.",
  },
  {
    href: "/earth",
    eyebrow: "Earth systems",
    title: "Earth & Events",
    description:
      "Pair DSCOVR EPIC imagery, Earth assets, and live natural event monitoring in one observation workflow.",
  },
  {
    href: "/space-weather",
    eyebrow: "Solar desk",
    title: "DONKI Monitor",
    description:
      "Track coronal mass ejections, flares, and geomagnetic storms with a cleaner mission-ops presentation.",
  },
  {
    href: "/library",
    eyebrow: "Archive layer",
    title: "Media Library Search",
    description:
      "Search NASA's image and video archive from the app instead of bouncing to raw archive endpoints.",
  },
  {
    href: "/exoplanets",
    eyebrow: "Deep catalog",
    title: "Exoplanet Board",
    description:
      "Scan recent discoveries from the Exoplanet Archive with quick stats and mission context.",
  },
  {
    href: "/capsule",
    eyebrow: "Personal artifact",
    title: "Date Capsule",
    description:
      "Generate a snapshot around any date, combining APOD, asteroid traffic, Earth imagery, and event context.",
  },
];

export default function HomePage() {
  const { data, error } = useSWR<DashboardPayload>("/api/nasa/dashboard", fetcher);
  const isLoading = !data && !error;

  return (
    <div className="pb-16">
      <section className="section-frame pt-12 md:pt-16">
        <div className="glass-panel overflow-hidden rounded-[2.5rem] px-6 py-10 md:px-10 md:py-14">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/70">
              SkyStream
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl xl:text-7xl">
              I rebuilt space data into one high signal mission dashboard.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">Everything you can think of with space research would be within reach here.
            </p>
          </div>

          <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {isLoading ? (
              <>
                <div className="metric-tile h-28 animate-pulse" />
                <div className="metric-tile h-28 animate-pulse" />
                <div className="metric-tile h-28 animate-pulse" />
                <div className="metric-tile h-28 animate-pulse" />
              </>
            ) : error ? (
              <div className="md:col-span-4">
                <DataState
                  title="Dashboard telemetry is offline"
                  description={error.message}
                  tone="error"
                />
              </div>
            ) : (
              <>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Asteroids today
                  </p>
                  <p className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl text-white">
                    {data?.asteroidCount ?? 0}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Live NeoWs objects in today&apos;s feed
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Mars photos loaded
                  </p>
                  <p className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl text-white">
                    {data?.marsPhotoCount ?? 0}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Current deck from rover APIs or archive fallback
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Solar alerts
                  </p>
                  {data?.solarAlerts === null ? (
                  <p className="mt-4 font-display text-lg sm:text-xl md:text-2xl text-white">
                    Still loading solar alerts...
                  </p>
                  ) : (
                    <p className="mt-4 font-display text-4xl text-white">
                      {data?.solarAlerts ?? 0}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    DONKI CME, flare, and geomagnetic storm count
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Active Earth events
                  </p>
                  <p className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl text-white">
                      {data?.activeEvents ?? 0}
                    </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Open EONET events across Earth systems
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section-frame mt-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
              Coverage map
            </p>
            <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl md:text-4xl">
              A broader, cleaner product surface
            </h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {missionCards.map((card) => (
            <MissionCard key={card.href} {...card} />
          ))}
        </div>
      </section>

      <section className="section-frame mt-12 grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            APOD spotlight
          </p>
          {data?.apod ? (
            <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-[1.15fr,0.85fr]">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
                <img
                  src={data.apod.imageUrl}
                  alt={data.apod.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                  {data.apod.date}
                </p>
                <h3 className="mt-4 font-display text-3xl text-white">
                  {data.apod.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {data.apod.explanation}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <DataState
                title="APOD not available right now"
                description="The page still works, but the NASA feed is unavailable at the moment."
                tone="empty"
              />
            </div>
          )}
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Library highlights
          </p>
          <div className="mt-6 space-y-4">
            {(data?.libraryHighlights || []).map((item) => (
              <div
                key={item.nasaId}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  {item.mediaType}
                </p>
                <h3 className="mt-2 font-display text-xl text-white">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-4 text-sm leading-7 text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
