export default function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(5,8,20,0.86)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-400 md:px-8">
        <p className="font-display text-base tracking-[0.12em] text-slate-100">
          SkyStream.pro is live.
        </p>
        <p className="max-w-4xl leading-7">
          Major NASA coverage including APOD, NeoWs, Mars Rover Photos, EPIC, Earth Assets, DONKI, EONET, the NASA Image and Video Library, and the Exoplanet Archive.
        </p>
        <p>
          &copy; 2025 {" "}
          <a
            href="https://nsisong.com"
            target="_blank"
            rel="noreferrer"
            className="rounded bg-white/5 px-2 py-1 text-slate-200 transition hover:bg-cyan-300/10 hover:text-cyan-100"
          >
            Isaac Emmanuel
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
