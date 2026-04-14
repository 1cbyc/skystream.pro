"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import DataState from "@/components/DataState";
import { fetcher } from "@/lib/fetcher";

type EpicItem = {
  id: string;
  caption: string;
  imageUrl: string;
  date: string;
};

type EarthAssetPayload = {
  lat: number;
  lon: number;
  date: string;
  id: string | null;
  url: string | null;
};

type EventPayload = {
  count: number;
  events: {
    id: string;
    title: string;
    categories: string[];
    geometry: { date?: string }[];
  }[];
};

export default function EarthPage() {
  const [lat, setLat] = useState("6.5244");
  const [lon, setLon] = useState("3.3792");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const earthUrl = useMemo(
    () => `/api/nasa/earth?lat=${lat}&lon=${lon}&date=${date}`,
    [date, lat, lon],
  );

  const epic = useSWR<EpicItem[]>("/api/nasa/epic?limit=6", fetcher);
  const earthAsset = useSWR<EarthAssetPayload>(earthUrl, fetcher);
  const events = useSWR<EventPayload>("/api/nasa/events?limit=8", fetcher);
  const epicLoading = !epic.data && !epic.error;
  const earthAssetLoading = !earthAsset.data && !earthAsset.error;

  return (
    <section className="section-frame py-12">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
          Earth observation
        </p>
        <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">
          EPIC frames, Earth assets, and natural event watchlists
        </h1>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl text-white">DSCOVR EPIC</h2>
            </div>
            {epicLoading ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="h-56 animate-pulse rounded-[1.5rem] bg-white/5" />
                <div className="h-56 animate-pulse rounded-[1.5rem] bg-white/5" />
              </div>
            ) : epic.error ? (
              <div className="mt-5">
                <DataState title="EPIC unavailable" description={epic.error.message} tone="error" />
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {(epic.data || []).map((frame) => (
                  <article
                    key={frame.id}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20"
                  >
                    <img
                      src={frame.imageUrl}
                      alt={frame.caption}
                      className="h-56 w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        {frame.date}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-200">
                        {frame.caption}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
              <h2 className="font-display text-2xl text-white">
                Earth asset lookup
              </h2>
              <div className="mt-5 grid gap-3">
                <input
                  type="number"
                  value={lat}
                  onChange={(event) => setLat(event.target.value)}
                  className="field"
                  placeholder="Latitude"
                />
                <input
                  type="number"
                  value={lon}
                  onChange={(event) => setLon(event.target.value)}
                  className="field"
                  placeholder="Longitude"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="field"
                />
              </div>

              <div className="mt-5">
                {earthAssetLoading ? (
                  <DataState title="Looking up Earth asset..." />
                ) : earthAsset.error ? (
                  <DataState
                    title="Earth asset lookup failed"
                    description={earthAsset.error.message}
                    tone="error"
                  />
                ) : earthAsset.data ? (
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-slate-300">
                      Asset date: {earthAsset.data.date || "Unavailable"}
                    </p>
                    {earthAsset.data.url ? (
                      <a
                        href={earthAsset.data.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex text-sm text-cyan-200"
                      >
                        Open NASA asset
                      </a>
                    ) : (
                      <p className="mt-4 text-sm text-slate-400">
                        NASA returned metadata without a public image URL for this
                        request window.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
              <h2 className="font-display text-2xl text-white">Live EONET events</h2>
              <div className="mt-5 space-y-3">
                {(events.data?.events || []).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      {event.categories.join(" • ") || "event"}
                    </p>
                    <h3 className="mt-2 font-display text-xl text-white">
                      {event.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
