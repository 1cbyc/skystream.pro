export default function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(5,8,20,0.86)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-400 md:px-8">
        <p className="font-display text-base tracking-[0.12em] text-slate-100">
          SkyStream.pro is now a single full-stack Next.js mission dashboard.
        </p>
        <p>
          Major NASA coverage includes APOD, NeoWs, Mars Rover Photos, EPIC,
          Earth Assets, DONKI, EONET, the NASA Image and Video Library, and the
          Exoplanet Archive.
        </p>
        <p>
          The original multi-service implementation is preserved under{" "}
          <span className="rounded bg-white/5 px-2 py-1 text-slate-200">
            v1/
          </span>
          .
        </p>
      </div>
    </footer>
  );
}
