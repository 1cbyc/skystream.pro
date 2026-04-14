"use client";

import { useState } from "react";
import useSWR from "swr";
import DataState from "@/components/DataState";
import { fetcher } from "@/lib/fetcher";

type ApodPayload = {
  date: string;
  title: string;
  explanation: string;
  imageUrl: string;
  mediaType: string;
  copyright: string | null;
};

export default function MoodPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const { data, error } = useSWR<ApodPayload>(
    `/api/nasa/apod?date=${date}`,
    fetcher,
  );
  const isLoading = !data && !error;

  return (
    <section className="section-frame py-12">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
              APOD explorer
            </p>
            <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">
              Astronomy Picture of the Day, rebuilt as a flagship feature
            </h1>
          </div>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(event) => setDate(event.target.value)}
            className="field max-w-xs"
          />
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="h-[28rem] animate-pulse rounded-[2rem] bg-white/5" />
              <div className="h-[28rem] animate-pulse rounded-[2rem] bg-white/5" />
            </div>
          ) : error ? (
            <DataState title="APOD is unavailable" description={error.message} tone="error" />
          ) : data ? (
            <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
                {data.mediaType === "image" ? (
                  <img
                    src={data.imageUrl}
                    alt={data.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[28rem] items-center justify-center p-8 text-center text-slate-300">
                    NASA returned non-image media for this date. Open the source
                    directly to view it.
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                  {data.date}
                </p>
                <h2 className="mt-4 font-display text-3xl text-white">
                  {data.title}
                </h2>
                {data.copyright ? (
                  <p className="mt-3 text-sm text-slate-400">
                    Credit: {data.copyright}
                  </p>
                ) : null}
                <p className="mt-6 text-sm leading-8 text-slate-300">
                  {data.explanation}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
