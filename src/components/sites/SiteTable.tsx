import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Sparkline } from "@/components/charts/Sparkline";
import { DeltaBadge } from "@/components/ui/Card";
import { fmtCompact, fmtCtr, fmtDelta, fmtInt, fmtPos } from "@/lib/format";
import type { Metrics } from "@/types";

export type SiteRow = {
  slug: string;
  name: string;
  domain: string;
  color: string;
  current: Metrics;
  change: { clicks: number | null; impressions: number | null; ctr: number | null; position: number | null };
  spark: { v: number }[];
};

export function SiteTable({ rows, period }: { rows: SiteRow[]; period: number }) {
  const max = Math.max(...rows.map((r) => r.current.clicks));
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500">
            <th className="px-5 pb-3 font-medium">Site</th>
            <th className="pb-3 font-medium">Clics</th>
            <th className="pb-3 font-medium">Impressions</th>
            <th className="pb-3 font-medium">CTR</th>
            <th className="pb-3 font-medium">Position</th>
            <th className="w-32 pb-3 font-medium">Tendance</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.slug} className="group border-t border-white/[0.05] transition hover:bg-white/[0.03]">
              <td className="px-5 py-3">
                <Link href={`/sites/${r.slug}?period=${period}`} className="flex items-center gap-3">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold"
                    style={{ background: `${r.color}22`, color: r.color }}
                  >
                    {r.name[0]}
                  </span>
                  <span>
                    <span className="block font-medium text-white">{r.name}</span>
                    <span className="block text-xs text-slate-500">{r.domain}</span>
                  </span>
                </Link>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span className="w-14 tabular-nums text-white">{fmtInt(r.current.clicks)}</span>
                  <DeltaBadge value={r.change.clicks} label={fmtDelta(r.change.clicks)} />
                </div>
                <div className="mt-1.5 h-1 w-28 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${(r.current.clicks / max) * 100}%`, background: r.color }} />
                </div>
              </td>
              <td className="py-3">
                <span className="tabular-nums text-slate-300">{fmtCompact(r.current.impressions)}</span>
                <span className="ml-2 text-xs text-slate-500">{fmtDelta(r.change.impressions)}</span>
              </td>
              <td className="py-3 tabular-nums text-slate-300">{fmtCtr(r.current.ctr)}</td>
              <td className="py-3">
                <span className="tabular-nums text-slate-300">{fmtPos(r.current.avgPosition)}</span>
                <span className="ml-2">
                  <DeltaBadge value={r.change.position} label={fmtDelta(r.change.position, "pl")} invert />
                </span>
              </td>
              <td className="py-3 pr-2">
                <div className="w-28">
                  <Sparkline data={r.spark} color={r.color} height={30} />
                </div>
              </td>
              <td className="pr-5">
                <ChevronRight size={16} className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-300" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
