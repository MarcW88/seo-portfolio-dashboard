import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Sparkline } from "@/components/charts/Sparkline";
import { DeltaBadge } from "@/components/ui/Card";
import { DataBadge } from "@/components/ui/DataBadge";
import { fmtCompact, fmtCtr, fmtDelta, fmtPos } from "@/lib/format";
import { parsePeriod, type PeriodSearchParams } from "@/lib/period";
import { getIndexation, getSiteRows } from "@/lib/data";

export default async function SitesPage({ searchParams }: { searchParams: PeriodSearchParams }) {
  const period = parsePeriod((await searchParams).period);
  const rows = await getSiteRows(period);
  return (
    <>
      <PageHeader
        eyebrow={<DataBadge />}
        title="Mes sites"
        description={`${rows.length} sites suivis · ${period} derniers jours`}
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => {
          const idx = getIndexation(r.slug);
          const trend = (r.change.clicks ?? 0) > 5 ? "En croissance" : (r.change.clicks ?? 0) < -5 ? "En baisse" : "Stable";
          return (
            <Link
              key={r.slug}
              href={`/sites/${r.slug}?period=${period}`}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-white/15"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl" style={{ background: r.color }} />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl text-sm font-bold" style={{ background: `${r.color}22`, color: r.color }}>
                    {r.name[0]}
                  </span>
                  <div>
                    <p className="font-medium text-white">{r.name}</p>
                    <p className="text-xs text-slate-500">
                      {r.domain} · {r.country}
                    </p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-slate-600 transition group-hover:text-white" />
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-white">{fmtCompact(r.current.clicks)}</span>
                <span className="text-xs text-slate-500">clics</span>
                <DeltaBadge value={r.change.clicks} label={fmtDelta(r.change.clicks)} />
              </div>
              <div className="-mx-1 mt-3">
                <Sparkline data={r.spark} color={r.color} height={56} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4 text-xs">
                <div>
                  <p className="text-slate-500">Impr.</p>
                  <p className="mt-0.5 font-medium text-slate-200">{fmtCompact(r.current.impressions)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Position</p>
                  <p className="mt-0.5 font-medium text-slate-200">{fmtPos(r.current.avgPosition)}</p>
                </div>
                <div>
                  <p className="text-slate-500">CTR</p>
                  <p className="mt-0.5 font-medium text-slate-200">{fmtCtr(r.current.ctr)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">{trend}</span>
                <span className="text-slate-500">
                  Indexation <span className="text-slate-300">{Math.round((idx.indexed / idx.total) * 100)} %</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
