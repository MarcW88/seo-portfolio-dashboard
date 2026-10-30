import { Sparkline } from "@/components/charts/Sparkline";
import { DeltaBadge } from "@/components/ui/Card";
import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  delta,
  deltaLabel,
  invert,
  icon: Icon,
  spark,
  color = "#818cf8",
  hint,
}: {
  label: string;
  value: string;
  delta?: number | null;
  deltaLabel?: string;
  invert?: boolean;
  icon: LucideIcon;
  spark?: { v: number }[];
  color?: string;
  hint?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 transition hover:border-white/15">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
        style={{ background: color }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="rounded-lg p-1.5" style={{ background: `${color}22`, color }}>
          <Icon size={14} />
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-white">{value}</span>
        {deltaLabel && <DeltaBadge value={delta ?? null} label={deltaLabel} invert={invert} />}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {spark && (
        <div className="-mx-1 mt-2">
          <Sparkline data={spark} color={color} />
        </div>
      )}
    </div>
  );
}
