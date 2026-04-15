"use client";

import { startTransition, useDeferredValue, useState } from "react";
import useSWR from "swr";
import DataState from "@/components/DataState";
import { fetcher } from "@/lib/fetcher";

type LibraryPayload = {
  totalHits: number;
  items: {
    nasaId: string;
    title: string;
    description: string;
    mediaType: string;
    previewUrl: string | null;
    dateCreated: string;
    center: string | null;
  }[];
};

export default function LibraryPage() {
  const [query, setQuery] = useState("nebula");
  const [mediaType, setMediaType] = useState("image");
  const deferredQuery = useDeferredValue(query);

  const { data, error } = useSWR<LibraryPayload>(
    `/api/nasa/library?query=${encodeURIComponent(deferredQuery)}&mediaType=${mediaType}&page=1`,
    fetcher,
  );
  const isLoading = !data && !error;

  return (
    <section className="section-frame py-12">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
              NASA archive
            </p>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl md:text-5xl">
              Search the NASA image and video library from the app
            </h1>
          </div>
          <div className="grid w-full gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-[minmax(0,20rem),12rem] xl:w-auto">
            <input
              type="text"
              value={query}
              onChange={(event) =>
                startTransition(() => {
                  setQuery(event.target.value);
                })
              }
              className="field"
              placeholder="Search for nebulae, ISS, Artemis..."
            />
            <select
              value={mediaType}
              onChange={(event) => setMediaType(event.target.value)}
              className="field"
            >
              <option value="image">Images</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="h-72 animate-pulse rounded-[1.75rem] bg-white/5" />
              <div className="h-72 animate-pulse rounded-[1.75rem] bg-white/5" />
              <div className="h-72 animate-pulse rounded-[1.75rem] bg-white/5" />
            </div>
          ) : error ? (
            <DataState title="Archive search unavailable" description={error.message} tone="error" />
          ) : data ? (
            <>
              <div className="metric-tile mb-6">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Total hits
                </p>
                <p className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl text-white">
                  {data.totalHits.toLocaleString()}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.items.slice(0, 12).map((item) => (
                  <article
                    key={`${item.nasaId}-${item.title}`}
                    className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]"
                  >
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.title}
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-black/20 text-sm text-slate-500">
                        No preview
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        {item.center || item.mediaType}
                      </p>
                      <h2 className="mt-3 break-words font-display text-xl sm:text-2xl text-white">
                        {item.title}
                      </h2>
                      <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-300">
                        {item.description}
                      </p>
                    </div>
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
