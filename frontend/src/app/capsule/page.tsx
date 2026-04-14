"use client";

import { useState } from "react";
import useSWR from "swr";
import DataState from "@/components/DataState";
import { fetcher } from "@/lib/fetcher";

type CapsulePayload = {
  date: string;
  apod: {
    title: string;
    explanation: string;
    imageUrl: string;
  } | null;
  asteroidCount: number;
  notableApproaches: {
    id: string;
    name: string;
    missDistanceKm: number;
  }[];
  events: {
    id: string;
    title: string;
    categories: string[];
  }[];
  earth: {
    date: string;
    url: string | null;
  } | null;
};

export default function CapsulePage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const { data, error } = useSWR<CapsulePayload>(
    `/api/nasa/capsule?date=${date}`,
    fetcher,
  );
  const isLoading = !data && !error;

  return (
    <section className="section-frame py-12">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
              Date capsule
            </p>
            <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">
              Build a richer NASA snapshot around a meaningful date
            </h1>
          </div>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="field max-w-xs"
          />
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-80 animate-pulse rounded-[2rem] bg-white/5" />
              <div className="h-80 animate-pulse rounded-[2rem] bg-white/5" />
            </div>
          ) : error ? (
            <DataState
              title="Capsule generation failed"
              description={error.message}
              tone="error"
            />
          ) : data ? (
            <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  APOD
                </p>
                {data.apod ? (
                  <>
                    <img
                      src={data.apod.imageUrl}
                      alt={data.apod.title}
                      className="mt-5 h-80 w-full rounded-[1.5rem] object-cover"
                    />
                    <h2 className="mt-5 font-display text-3xl text-white">
                      {data.apod.title}
                    </h2>
                    <p className="mt-3 text-sm leading-8 text-slate-300">
                      {data.apod.explanation}
                    </p>
                  </>
                ) : (
                  <DataState
                    title="No APOD for this date"
                    description="NASA did not return APOD media for the selected day."
                    tone="empty"
                  />
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Asteroid traffic
                  </p>
                  <p className="mt-3 font-display text-4xl text-white">
                    {data.asteroidCount}
                  </p>
                  <div className="mt-4 space-y-3">
                    {data.notableApproaches.map((item) => (
                      <div key={item.id} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                        <p className="font-display text-xl text-white">
                          {item.name}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          {Math.round(item.missDistanceKm).toLocaleString()} km
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Earth asset
                  </p>
                  {data.earth?.url ? (
                    <a
                      href={data.earth.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm text-cyan-200"
                    >
                      Open matching Earth asset
                    </a>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">
                      No Earth imagery asset was returned for the selected date.
                    </p>
                  )}
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Event context
                  </p>
                  <div className="mt-4 space-y-3">
                    {data.events.length ? (
                      data.events.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4"
                        >
                          <p className="font-display text-xl text-white">
                            {event.title}
                          </p>
                          <p className="mt-2 text-sm text-slate-300">
                            {event.categories.join(" • ")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">
                        No EONET events were recorded for this date window.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
