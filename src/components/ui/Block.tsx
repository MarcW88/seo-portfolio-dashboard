import type { LucideIcon } from "lucide-react";

export function Block({
  title,
  items,
  icon: Icon,
  className = "",
}: {
  title: string;
  items: string[];
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 ${className}`}
    >
      <div className="mb-3 flex items-center gap-2">
        {Icon && (
          <span className="rounded-lg bg-white/5 p-1.5 text-slate-300">
            <Icon size={14} />
          </span>
        )}
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <ul className="space-y-1.5 text-sm text-slate-400">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}
