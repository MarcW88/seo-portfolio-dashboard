import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, StatusPill } from "@/components/ui/Card";
import { BarsChart } from "@/components/charts/BarsChart";
import { getIndexation, getSites } from "@/lib/data";

export default async function IndexationPage() {
  const sites = await getSites();
  const rows = sites.map((s) => ({ ...s, ...getIndexation(s.slug) }));
  const chart = rows.map((r) => ({ label: r.name.split(" ")[0], taux: Math.round((r.indexed / r.total) * 100) }));

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <StatusPill tone="v2">Module V2</StatusPill>
            <StatusPill tone="mock">Données fictives</StatusPill>
          </>
        }
        title="Indexation"
        description="Sitemaps + URL Inspection API + crawl technique. Les taux portent sur les URL inspectées, pas sur tout le site."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Taux d'indexation" subtitle="% des URL inspectées indexées" />
          <BarsChart data={chart} dataKey="taux" name="% indexé" colors={rows.map((r) => r.color)} height={240} />
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Comparaison des sites" />
          <div className="space-y-4">
            {rows.map((r) => (
              <Link key={r.slug} href={`/sites/${r.slug}/indexation`} className="block rounded-xl p-2 transition hover:bg-white/[0.03]">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-white">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                    {r.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {r.indexed} / {r.total} inspectées · <span className="text-rose-300">{r.issues} anomalies</span>
                  </span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="bg-emerald-400" style={{ width: `${(r.indexed / r.total) * 100}%` }} />
                  <div className="bg-amber-400" style={{ width: `${(r.pending / r.total) * 100}%` }} />
                  <div className="bg-rose-400" style={{ width: `${(r.issues / r.total) * 100}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
