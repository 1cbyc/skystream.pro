"use client";

import { useState } from "react";
import useSWR from "swr";
import DataState from "@/components/DataState";
import { fetcher } from "@/lib/fetcher";

type WeatherPayload = {
  windowStart: string;
  windowEnd: string;
  cmes: { activityID?: string; startTime?: string; note?: string }[];
  flares: { flrID?: string; beginTime?: string; classType?: string }[];
  storms: { gstID?: string; startTime?: string; kpIndex?: number }[];
};

export default function SpaceWeatherPage() {
  const [days, setDays] = useState("14");
  const { data, error } = useSWR<WeatherPayload>(
    `/api/nasa/weather?days=${days}`,
    fetcher,
  );
  const isLoading = !data && !error;

  return (
    <section className="section-frame py-12">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
              DONKI digest
            </p>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl md:text-5xl">
              Solar weather in a cleaner operations format
            </h1>
          </div>
          <input
            type="number"
            min="3"
            max="30"
            value={days}
            onChange={(event) => setDays(event.target.value)}
            className="field w-full sm:max-w-[10rem]"
          />
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className="metric-tile h-24 animate-pulse" />
              <div className="metric-tile h-24 animate-pulse" />
              <div className="metric-tile h-24 animate-pulse" />
            </div>
          ) : error ? (
            <DataState
              title="Space weather feed unavailable"
              description={error.message}
              tone="error"
            />
          ) : data ? (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Coronal mass ejections
                  </p>
                  <p className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl text-white">
                    {data.cmes.length}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Solar flares
                  </p>
                  <p className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl text-white">
                    {data.flares.length}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Geomagnetic storms
                  </p>
                  <p className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl text-white">
                    {data.storms.length}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="font-display text-xl sm:text-2xl text-white">CMEs</h2>
                  <div className="mt-5 space-y-3">
                    {data.cmes.map((item, index) => (
                      <div key={`${item.activityID || "cme"}-${index}`} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-slate-200">{item.activityID || "Unlabeled CME"}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                          {item.startTime || "No timestamp"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="font-display text-xl sm:text-2xl text-white">Flares</h2>
                  <div className="mt-5 space-y-3">
                    {data.flares.map((item, index) => (
                      <div key={`${item.flrID || "flare"}-${index}`} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-slate-200">
                          {item.classType || "Unknown class"}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                          {item.beginTime || "No timestamp"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                  <h2 className="font-display text-xl sm:text-2xl text-white">Storms</h2>
                  <div className="mt-5 space-y-3">
                    {data.storms.map((item, index) => (
                      <div key={`${item.gstID || "storm"}-${index}`} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-slate-200">
                          KP Index {item.kpIndex ?? "unknown"}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                          {item.startTime || "No timestamp"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
