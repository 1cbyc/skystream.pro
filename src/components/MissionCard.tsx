import Link from "next/link";

type MissionCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
};

export default function MissionCard({
  href,
  eyebrow,
  title,
  description,
}: MissionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/10 md:p-6"
    >
      <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/70">
        {eyebrow}
      </p>
      <h3 className="mt-4 font-display text-lg sm:text-xl md:text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300 md:leading-7">{description}</p>
    </Link>
  );
}
