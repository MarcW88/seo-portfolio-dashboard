import { notFound } from "next/navigation";
import { Eye, FileText, MousePointerClick, Percent, Target } from "lucide-react";
import { KpiCard } from "@/components/metrics/KpiCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { TrendChart } from "@/components/charts/TrendChart";
import { BarsChart } from "@/components/charts/BarsChart";
import { PageTable } from "@/components/tables/PageTable";
import { AlertList } from "@/components/alerts/AlertList";
import { IndexationSummary } from "@/components/sites/IndexationSummary";
import { fmtCompact, fmtCtr, fmtDelta, fmtPos } from "@/lib/format";
import { parsePeriod, type PeriodSearchParams } from "@/lib/period";
import { alerts, compare, getSite, positionBuckets, sitePages, sparkline, trendSeries } from "@/lib/mock/data";

export default async function SiteOverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: PeriodSearchParams;
}) {
  const { siteId } = await params;
  const period = parsePeriod((await searchParams).period);
  const site = getSite(siteId) ?? notFound();
  const { current, change } = compare(site.daily, period);
  const pages = sitePages(siteId, period);
  const byDelta = [...pages].sort((a, b) => b.clicks - b.prevClicks - (a.clicks - a.prevClicks));
  const siteAlerts = alerts(period).filter((a) => a.siteSlug === siteId);

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="Clics" value={fmtCompact(current.clicks)} delta={change.clicks} deltaLabel={fmtDelta(change.clicks)} icon={MousePointerClick} color={site.color} spark={sparkline(site.daily, period)} />
        <KpiCard label="Impressions" value={fmtCompact(current.impressions)} delta={change.impressions} deltaLabel={fmtDelta(change.impressions)} icon={Eye} color="#22d3ee" spark={sparkline(site.daily, period, "impressions")} />
        <KpiCard label="Position" value={fmtPos(current.avgPosition)} delta={change.position} deltaLabel={fmtDelta(change.position, "pl")} invert icon={Target} color="#fbbf24" />
        <KpiCard label="CTR" value={fmtCtr(current.ctr)} delta={change.ctr} deltaLabel={fmtDelta(change.ctr, "pt")} icon={Percent} color="#34d399" />
        <KpiCard label="Pages actives" value={String(pages.length)} icon={FileText} color="#a78bfa" hint="≥ 1 impression" />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Performance organique" subtitle={`${period} derniers jours vs période précédente`} />
          <TrendChart data={trendSeries(site.daily, period)} />
        </Card>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Distribution des positions" subtitle="Nombre de pages par tranche" />
            <BarsChart data={positionBuckets(siteId, period)} dataKey="pages" name="Pages" colors={["#34d399", "#22d3ee", "#818cf8", "#475569"]} height={160} />
          </Card>
          <Card>
            <CardHeader title="Indexation connue" subtitle="Échantillon inspecté · module V2" />
            <IndexationSummary slug={siteId} />
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Top progressions" subtitle="Plus fortes hausses de clics" />
          <PageTable rows={byDelta.slice(0, 5)} />
        </Card>
        <Card>
          <CardHeader title="Top régressions" subtitle="Plus fortes baisses de clics" />
          <PageTable rows={byDelta.slice(-5).reverse()} />
        </Card>
        {siteAlerts.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader title="Alertes du site" />
            <AlertList alerts={siteAlerts} />
          </Card>
        )}
      </div>
    </>
  );
}
