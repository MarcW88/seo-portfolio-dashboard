export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset] ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function DeltaBadge({ value, label, invert = false }: { value: number | null; label: string; invert?: boolean }) {
  const good = value !== null && (invert ? value < 0 : value > 0);
  const bad = value !== null && (invert ? value > 0 : value < 0);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        good ? "bg-emerald-400/10 text-emerald-300" : bad ? "bg-rose-400/10 text-rose-300" : "bg-white/5 text-slate-400"
      }`}
    >
      {label}
    </span>
  );
}

export function StatusPill({ tone, children }: { tone: "v2" | "futur" | "mock" | "live"; children: React.ReactNode }) {
  const styles = {
    v2: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
    futur: "bg-fuchsia-400/10 text-fuchsia-300 ring-fuchsia-400/20",
    mock: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
    live: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${styles[tone]}`}>{children}</span>;
}
