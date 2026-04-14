"use client";

import { addDays } from "date-fns";
import { useMemo, useState } from "react";
import useSWR from "swr";
import DataState from "@/components/DataState";
import { fetcher } from "@/lib/fetcher";

type NeoItem = {
  id: string;
  name: string;
  hazardous: boolean;
  date: string;
  missDistanceKm: number;
  velocityKph: number;
  diameterMinMeters: number;
  diameterMaxMeters: number;
  nasaJplUrl: string | null;
};

type NeoPayload = {
  count: number;
  items: NeoItem[];
};

export default function ImpactPage() {
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    addDays(new Date(), 3).toISOString().slice(0, 10),
  );

  const url = useMemo(
    () => `/api/nasa/neo?startDate=${startDate}&endDate=${endDate}`,
    [endDate, startDate],
  );
  const { data, error } = useSWR<NeoPayload>(url, fetcher);
  const isLoading = !data && !error;

  return (
    <section className="section-frame py-12">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
              NeoWs watch
            </p>
            <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">
              Near-Earth object tracking with better signal
            </h1>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="field"
            />
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="field"
            />
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="metric-tile h-24 animate-pulse" />
              <div className="metric-tile h-24 animate-pulse" />
              <div className="metric-tile h-24 animate-pulse" />
            </div>
          ) : error ? (
            <DataState
              title="Asteroid telemetry unavailable"
              description={error.message}
              tone="error"
            />
          ) : data ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Objects in window
                  </p>
                  <p className="mt-3 font-display text-4xl text-white">
                    {data.count}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Hazardous flagged
                  </p>
                  <p className="mt-3 font-display text-4xl text-white">
                    {data.items.filter((item) => item.hazardous).length}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Closest pass
                  </p>
                  <p className="mt-3 font-display text-2xl text-white">
                    {data.items[0]
                      ? `${Math.round(data.items[0].missDistanceKm).toLocaleString()} km`
                      : "No objects"}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 xl:grid-cols-2">
                {data.items.slice(0, 12).map((item) => (
                  <article
                    key={`${item.id}-${item.date}`}
                    className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                          {item.date}
                        </p>
                        <h2 className="mt-3 font-display text-2xl text-white">
                          {item.name}
                        </h2>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em] ${
                          item.hazardous
                            ? "bg-red-400/20 text-red-100"
                            : "bg-emerald-400/20 text-emerald-100"
                        }`}
                      >
                        {item.hazardous ? "hazardous" : "tracked"}
                      </span>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                          Miss distance
                        </p>
                        <p className="mt-2 text-sm text-slate-100">
                          {Math.round(item.missDistanceKm).toLocaleString()} km
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                          Velocity
                        </p>
                        <p className="mt-2 text-sm text-slate-100">
                          {Math.round(item.velocityKph).toLocaleString()} kph
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                          Diameter
                        </p>
                        <p className="mt-2 text-sm text-slate-100">
                          {Math.round(item.diameterMinMeters)} to{" "}
                          {Math.round(item.diameterMaxMeters)} m
                        </p>
                      </div>
                    </div>
                    {item.nasaJplUrl ? (
                      <a
                        href={item.nasaJplUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex text-sm text-cyan-200 transition hover:text-cyan-100"
                      >
                        Open JPL profile
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
