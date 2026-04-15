type DataStateProps = {
  title: string;
  description?: string;
  tone?: "loading" | "error" | "empty";
};

export default function DataState({
  title,
  description,
  tone = "loading",
}: DataStateProps) {
  const toneClass =
    tone === "error"
      ? "border-red-400/30 bg-red-400/10 text-red-100"
      : tone === "empty"
        ? "border-white/10 bg-white/5 text-slate-200"
        : "border-cyan-400/20 bg-cyan-400/10 text-cyan-100";

  return (
    <div className={`rounded-2xl border p-4 md:rounded-3xl md:p-6 ${toneClass}`}>
      <p className="font-display text-base sm:text-lg md:text-xl">{title}</p>
      {description ? <p className="mt-2 text-sm opacity-80">{description}</p> : null}
    </div>
  );
}
