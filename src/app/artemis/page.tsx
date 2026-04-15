"use client";

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
    detailsUrl: string | null;
    assetManifestUrl: string | null;
  }[];
};

type CuratedVideo = LibraryPayload["items"][number];

const missionLinks = [
  {
    title: "Artemis II mission page",
    href: "https://www.nasa.gov/mission/artemis-ii/",
    description: "NASA's official mission overview, crew details, and program context.",
  },
  {
    title: "NASA+ live coverage",
    href: "https://plus.nasa.gov/",
    description: "NASA's official streaming surface for mission coverage and live programming.",
  },
  {
    title: "NASA YouTube channel",
    href: "https://www.youtube.com/@NASA",
    description: "Official NASA YouTube home for live coverage, clips, and mission videos.",
  },
  {
    title: "Artemis II coverage podcast",
    href: "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/artemis-ii-bringing-the-mission-to-you/",
    description:
      "NASA's March 20, 2026 episode about how the public can watch and follow Artemis II.",
  },
];

export default function ArtemisPage() {
  const { data, error } = useSWR<LibraryPayload>(
    "/api/nasa/library?query=Artemis%20II&mediaType=video&page=1",
    fetcher,
  );
  const isLoading = !data && !error;
  const items = data?.items || [];
  const missionOverview =
    items.find((item) => /mission overview/i.test(item.title)) || null;
  const launchVideo =
    items.find(
      (item) =>
        /liftoff|launch|fueling operations|tanking/i.test(item.title),
    ) || null;
  const flightHighlights = items.filter((item) =>
    /flight day|highlights/i.test(item.title),
  );
  const curatedVideos = [
    { label: "Launch", item: launchVideo },
    { label: "Mission overview", item: missionOverview },
    { label: "Flight highlights", item: flightHighlights[0] || null },
  ].filter((entry): entry is { label: string; item: CuratedVideo } => Boolean(entry.item));

  const watchHrefFor = (label: string, item: CuratedVideo) => {
    if (label === "Launch") {
      return item.detailsUrl || "https://plus.nasa.gov/";
    }

    return item.detailsUrl || item.assetManifestUrl || "https://www.youtube.com/@NASA";
  };

  return (
    <section className="section-frame py-12">
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
          Artemis program
        </p>
        <h1 className="mt-3 font-display text-3xl text-white md:text-5xl">
          Artemis II mission desk
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
          A dedicated place for the current Artemis mission story, official NASA
          viewing links, and related mission video coverage. The current crewed
          mission is Artemis II, and NASA has directed the public to NASA+,
          mission blogs, and the agency YouTube channel for watch-along coverage.
        </p>

        <div className="mt-8 grid gap-4 xl:grid-cols-[0.95fr,1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Official watch surfaces
            </p>
            <div className="mt-5 space-y-3">
              {missionLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-[1.4rem] border border-white/10 bg-black/20 p-4 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                >
                  <h2 className="font-display text-xl text-white">{link.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Artemis II video stream
            </p>
            {isLoading ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="h-64 animate-pulse rounded-[1.5rem] bg-white/5" />
                <div className="h-64 animate-pulse rounded-[1.5rem] bg-white/5" />
              </div>
            ) : error ? (
              <div className="mt-5">
                <DataState
                  title="Artemis video feed unavailable"
                  description={error.message}
                  tone="error"
                />
              </div>
            ) : (
              <div className="mt-5">
                <div className="grid gap-4 lg:grid-cols-3">
                  {curatedVideos.map(({ label, item }) => (
                    <article
                      key={`${label}-${item.nasaId}`}
                      className="overflow-hidden rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10"
                    >
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.title}
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-black/30 text-sm text-slate-500">
                          No preview
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">
                          {label}
                        </p>
                        <h3 className="mt-2 font-display text-xl text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-300">
                          {item.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <a
                            href={watchHrefFor(label, item)}
                            target="_blank"
                            rel="noreferrer"
                            className="button-primary"
                          >
                            {label === "Launch" ? "Watch coverage" : "Watch now"}
                          </a>
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
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {items.slice(0, 6).map((item) => (
                  <article
                    key={`${item.nasaId}-${item.title}`}
                    className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20"
                  >
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.title}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-black/30 text-sm text-slate-500">
                        No preview
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        {item.center || item.mediaType}
                      </p>
                      <h3 className="mt-2 font-display text-xl text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-300">
                        {item.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
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
                          Open NASA asset manifest
                        </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
