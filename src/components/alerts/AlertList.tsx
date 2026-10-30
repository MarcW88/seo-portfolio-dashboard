import Link from "next/link";
import { AlertOctagon, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import type { MockAlert } from "@/lib/mock/data";

export const SEVERITY = {
  critical: { label: "Critique", icon: AlertOctagon, cls: "text-rose-300 bg-rose-400/10 ring-rose-400/20" },
  warning: { label: "À surveiller", icon: AlertTriangle, cls: "text-amber-300 bg-amber-400/10 ring-amber-400/20" },
  opportunity: { label: "Opportunité", icon: Lightbulb, cls: "text-sky-300 bg-sky-400/10 ring-sky-400/20" },
  positive: { label: "Positif", icon: TrendingUp, cls: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/20" },
} as const;

export function AlertList({ alerts, compact = false }: { alerts: MockAlert[]; compact?: boolean }) {
  return (
    <ul className="space-y-2">
      {alerts.map((a) => {
        const s = SEVERITY[a.severity];
        return (
          <li key={a.id}>
            <Link
              href={`/sites/${a.siteSlug}`}
              className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition hover:border-white/10 hover:bg-white/[0.05]"
            >
              <span className={`mt-0.5 rounded-lg p-1.5 ring-1 ${s.cls}`}>
                <s.icon size={14} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-white">{a.title}</span>
                  <span className="shrink-0 text-[11px] text-slate-500">{a.date}</span>
                </span>
                <span className="block truncate text-xs text-slate-400">
                  {a.site} · {a.detail}
                </span>
              </span>
              {!compact && (
                <span className="hidden shrink-0 gap-1 sm:flex">
                  <span className="rounded-lg px-2 py-1 text-xs text-slate-400 ring-1 ring-white/10 hover:text-white">Acquitter</span>
                  <span className="rounded-lg px-2 py-1 text-xs text-slate-400 ring-1 ring-white/10 hover:text-white">Résoudre</span>
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
