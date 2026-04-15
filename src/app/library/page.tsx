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
    keywords: string[];
    detailsUrl: string | null;
    assetManifestUrl: string | null;
  }[];
};

export default function LibraryPage() {
  const [query, setQuery] = useState("nebula");
  const [mediaType, setMediaType] = useState("image");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const { data, error } = useSWR<LibraryPayload>(
    `/api/nasa/library?query=${encodeURIComponent(deferredQuery)}&mediaType=${mediaType}&page=${page}`,
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
                  setPage(1);
                  setQuery(event.target.value);
                })
              }
              className="field"
              placeholder="Search for nebulae, ISS, Artemis..."
            />
            <select
              value={mediaType}
              onChange={(event) => {
                setPage(1);
                setMediaType(event.target.value);
              }}
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
              <div className="mb-6 grid gap-4 md:grid-cols-[0.45fr,0.55fr]">
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Total hits
                  </p>
                  <p className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl text-white">
                    {data.totalHits.toLocaleString()}
                  </p>
                </div>
                <div className="metric-tile">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Archive note
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    You can now page through the archive and open full item details
                    instead of only seeing clipped overview cards.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.items.map((item) => {
                  const isOpen = selectedId === item.nasaId;

                  return (
                  <article
                    key={`${item.nasaId}-${item.title}`}
                    className={`overflow-hidden rounded-[1.75rem] border bg-white/[0.03] transition ${
                      isOpen
                        ? "border-cyan-300/35 shadow-[0_0_0_1px_rgba(103,232,249,0.2)]"
                        : "border-white/10"
                    }`}
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
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedId((current) =>
                              current === item.nasaId ? null : item.nasaId,
                            )
                          }
                          className="button-secondary"
                        >
                          {isOpen
                            ? "Close full details"
                            : "Open full details"}
                        </button>
                        {item.detailsUrl ? (
                          <a
                            href={item.detailsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="button-secondary"
                          >
                            Open NASA page
                          </a>
                        ) : null}
                        {item.assetManifestUrl ? (
                          <a
                            href={item.assetManifestUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="button-secondary"
                          >
                            Open asset manifest
                          </a>
                        ) : null}
                      </div>
                      {isOpen ? (
                        <div className="mt-5 rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-4">
                          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">
                            Full archive detail
                          </p>
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <div className="rounded-[1.15rem] border border-white/10 bg-black/20 p-4">
                              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                Center
                              </p>
                              <p className="mt-2 text-sm text-white">
                                {item.center || "NASA"}
                              </p>
                            </div>
                            <div className="rounded-[1.15rem] border border-white/10 bg-black/20 p-4">
                              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                                Created
                              </p>
                              <p className="mt-2 text-sm text-white">
                                {item.dateCreated || "Unknown"}
                              </p>
                            </div>
                          </div>
                          {item.keywords.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.keywords.slice(0, 10).map((keyword) => (
                                <span
                                  key={keyword}
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </article>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="button-secondary"
                  disabled={page === 1}
                >
                  Previous page
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  className="button-primary"
                >
                  Next page
                </button>
                <p className="self-center text-sm text-slate-400">
                  Viewing page {page}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
