"use client";

import useSWR from "swr";
import DataState from "@/components/DataState";
import { fetcher } from "@/lib/fetcher";

type ExoplanetPayload = {
  name: string;
  host: string;
  method: string;
  year: number;
  facility: string;
  distanceParsecs: number;
  radiusEarths: number;
  massEarths: number;
  orbitalPeriodDays: number;
}[];

export default function ExoplanetsPage() {
  const { data, error } = useSWR<ExoplanetPayload>(
    "/api/nasa/exoplanets?limit=24",
    fetcher,
  );
  const isLoading = !data && !error;

  return (
    <section className="section-frame py-12">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
          Exoplanet archive
        </p>
        <h1 className="mt-3 font-display text-3xl text-white md:text-5xl">
          Recent exoplanet discoveries with quick discovery context
        </h1>

        <div className="mt-8">
          {isLoading ? (
            <div className="metric-tile h-28 animate-pulse" />
          ) : error ? (
            <DataState
              title="Exoplanet archive unavailable"
              description={error.message}
              tone="error"
            />
          ) : data ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Records loaded
                  </p>
                  <p className="mt-3 font-display text-4xl text-white">
                    {data.length}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Newest discovery year
                  </p>
                  <p className="mt-3 font-display text-4xl text-white">
                    {Math.max(...data.map((item) => item.year))}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Discovery methods
                  </p>
                  <p className="mt-3 font-display text-4xl text-white">
                    {new Set(data.map((item) => item.method)).size}
                  </p>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10">
                <div className="overflow-x-auto">
                  <table className="min-w-[42rem] divide-y divide-white/10">
                    <thead className="bg-white/[0.04]">
                      <tr className="text-left text-xs uppercase tracking-[0.24em] text-slate-400">
                        <th className="px-4 py-4">Planet</th>
                        <th className="px-4 py-4">Host</th>
                        <th className="px-4 py-4">Method</th>
                        <th className="px-4 py-4">Year</th>
                        <th className="px-4 py-4">Facility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-white/[0.02]">
                      {data.map((planet) => (
                        <tr key={`${planet.name}-${planet.year}`} className="text-sm text-slate-200">
                          <td className="px-4 py-4 font-medium text-white">
                            {planet.name}
                          </td>
                          <td className="px-4 py-4">{planet.host}</td>
                          <td className="px-4 py-4">{planet.method}</td>
                          <td className="px-4 py-4">{planet.year}</td>
                          <td className="px-4 py-4">{planet.facility}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
