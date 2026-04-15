"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import DataState from "@/components/DataState";
import { fetcher } from "@/lib/fetcher";

type MarsPayload = {
  rover: string;
  manifest: {
    rover: string;
    status: string;
    maxSol: number;
    launchDate: string;
    landingDate: string;
    totalPhotos: number;
  };
  photos: {
    id: string;
    rover: string;
    camera: string;
    imageUrl: string;
    earthDate: string;
    sol: number;
  }[];
};

export default function MarsPage() {
  const [rover, setRover] = useState("curiosity");
  const [page, setPage] = useState(1);

  const url = useMemo(
    () => `/api/nasa/mars/photos?rover=${rover}&page=${page}`,
    [page, rover],
  );
  const { data, error } = useSWR<MarsPayload>(url, fetcher);
  const isLoading = !data && !error;

  return (
    <section className="section-frame py-12">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
              Mars desk
            </p>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl md:text-5xl">
              Rover imagery, manifests, and mission rhythm
            </h1>
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <select
              value={rover}
              onChange={(event) => {
                setPage(1);
                setRover(event.target.value);
              }}
              className="field w-full sm:min-w-[12rem] sm:w-auto"
            >
              <option value="curiosity">Curiosity</option>
              <option value="perseverance">Perseverance</option>
              <option value="opportunity">Opportunity</option>
              <option value="spirit">Spirit</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              <div className="metric-tile h-24 animate-pulse" />
              <div className="metric-tile h-24 animate-pulse" />
              <div className="metric-tile h-24 animate-pulse" />
              <div className="metric-tile h-24 animate-pulse" />
            </div>
          ) : error ? (
            <DataState title="Mars feed unavailable" description={error.message} tone="error" />
          ) : data ? (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Rover
                  </p>
                  <p className="mt-3 font-display text-xl sm:text-2xl md:text-3xl text-white">
                    {data.manifest.rover}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Status
                  </p>
                  <p className="mt-3 font-display text-xl sm:text-2xl md:text-3xl text-white">
                    {data.manifest.status}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Max sol
                  </p>
                  <p className="mt-3 font-display text-xl sm:text-2xl md:text-3xl text-white">
                    {data.manifest.maxSol.toLocaleString()}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Total photos
                  </p>
                  <p className="mt-3 font-display text-xl sm:text-2xl md:text-3xl text-white">
                    {data.manifest.totalPhotos.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.photos.map((photo) => (
                  <article
                    key={photo.id}
                    className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={`${photo.rover} captured by ${photo.camera}`}
                      className="h-72 w-full object-cover"
                    />
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        Sol {photo.sol}
                      </p>
                      <h2 className="mt-3 font-display text-2xl text-white">
                        {photo.camera}
                      </h2>
                      <p className="mt-2 text-sm text-slate-300">
                        Earth date: {photo.earthDate}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="button-secondary flex-1 sm:flex-none"
                  disabled={page === 1}
                >
                  Previous page
                </button>
                <button
                  type="button"
                  onClick={() => setPage((value) => value + 1)}
                  className="button-primary flex-1 sm:flex-none"
                >
                  Next page
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
