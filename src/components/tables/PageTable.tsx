import { DeltaBadge } from "@/components/ui/Card";
import { fmtCompact, fmtCtr, fmtDelta, fmtInt, fmtPos } from "@/lib/format";
import { pctChange } from "@/lib/analytics/metrics";
import type { PageRow } from "@/lib/mock/data";

type Row = PageRow & { site?: string; color?: string };

export function PageTable({ rows, showSite = false }: { rows: Row[]; showSite?: boolean }) {
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500">
            <th className="px-5 pb-3 font-medium">URL</th>
            <th className="pb-3 font-medium">Clics</th>
            <th className="pb-3 font-medium">Δ</th>
            <th className="pb-3 font-medium">Impr.</th>
            <th className="pb-3 font-medium">CTR</th>
            <th className="pb-3 pr-5 font-medium">Pos.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const delta = pctChange(r.clicks, r.prevClicks);
            const path = new URL(r.url).pathname;
            return (
              <tr key={r.url} className="border-t border-white/[0.05] hover:bg-white/[0.03]">
                <td className="max-w-[320px] px-5 py-2.5">
                  <span className="block truncate text-slate-200">{path}</span>
                  {showSite && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
                      {r.site}
                    </span>
                  )}
                </td>
                <td className="py-2.5 tabular-nums text-white">{fmtInt(r.clicks)}</td>
                <td className="py-2.5">
                  <DeltaBadge value={delta} label={fmtDelta(delta)} />
                </td>
                <td className="py-2.5 tabular-nums text-slate-400">{fmtCompact(r.impressions)}</td>
                <td className="py-2.5 tabular-nums text-slate-400">{fmtCtr(r.ctr)}</td>
                <td className="py-2.5 pr-5">
                  <span
                    className={`rounded-md px-1.5 py-0.5 tabular-nums text-xs ${
                      r.position <= 3
                        ? "bg-emerald-400/10 text-emerald-300"
                        : r.position <= 10
                          ? "bg-sky-400/10 text-sky-300"
                          : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {fmtPos(r.position)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
