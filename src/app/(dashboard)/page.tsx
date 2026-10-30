import Link from "next/link";
import { Bell, Globe, MousePointerClick, Eye, Percent, Target } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/metrics/KpiCard";
import { Card, CardHeader, StatusPill } from "@/components/ui/Card";
import { TrendChart } from "@/components/charts/TrendChart";
import { ShareDonut } from "@/components/charts/ShareDonut";
import { Base100Chart } from "@/components/charts/Base100Chart";
import { SiteTable } from "@/components/sites/SiteTable";
import { AlertList } from "@/components/alerts/AlertList";
import { fmtCompact, fmtCtr, fmtDelta, fmtPos } from "@/lib/format";
import { parsePeriod, type PeriodSearchParams } from "@/lib/period";
import { SITES, alerts, base100Series, compare, portfolioDaily, siteRows, sparkline, trendSeries } from "@/lib/mock/data";

export default async function GlobalViewPage({ searchParams }: { searchParams: PeriodSearchParams }) {
  const period = parsePeriod((await searchParams).period);
  const daily = portfolioDaily();
  const { current, change } = compare(daily, period);
  const rows = siteRows(period);
  const growing = rows.filter((r) => (r.change.clicks ?? 0) > 0).length;
  const allAlerts = alerts(period);
  const urgent = allAlerts.filter((a) => a.severity === "critical" || a.severity === "warning");

  return (
    <>
      <PageHeader
        eyebrow={<StatusPill tone="mock">Données fictives</StatusPill>}
        title="Bonjour Marc"
        description={`Ton portefeuille sur les ${period} derniers jours, comparé à la période précédente.`}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Clics" value={fmtCompact(current.clicks)} delta={change.clicks} deltaLabel={fmtDelta(change.clicks)} icon={MousePointerClick} color="#818cf8" spark={sparkline(daily, period)} />
        <KpiCard label="Impressions" value={fmtCompact(current.impressions)} delta={change.impressions} deltaLabel={fmtDelta(change.impressions)} icon={Eye} color="#22d3ee" spark={sparkline(daily, period, "impressions")} />
        <KpiCard label="Position moyenne" value={fmtPos(current.avgPosition)} delta={change.position} deltaLabel={fmtDelta(change.position, "pl")} invert icon={Target} color="#fbbf24" hint="Pondérée par les impressions" />
        <KpiCard label="CTR" value={fmtCtr(current.ctr)} delta={change.ctr} deltaLabel={fmtDelta(change.ctr, "pt")} icon={Percent} color="#34d399" hint="Σ clics / Σ impressions" />
        <KpiCard label="Sites suivis" value={String(SITES.length)} icon={Globe} color="#a78bfa" hint={`${growing} en croissance`} />
        <KpiCard label="Alertes actives" value={String(urgent.length)} icon={Bell} color="#f472b6" hint={`${urgent.filter((a) => a.severity === "critical").length} critiques`} />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Évolution du portefeuille" subtitle="Tous les sites · comparaison à la période précédente" />
          <TrendChart data={trendSeries(daily, period)} />
        </Card>
        <Card>
          <CardHeader title="Répartition des clics" subtitle="Part de chaque site" />
          <ShareDonut centerLabel="clics" data={rows.map((r) => ({ name: r.name, value: r.current.clicks, color: r.color }))} />
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Performance par site"
            subtitle="Clique sur un site pour ouvrir sa fiche"
            action={<Link href={`/sites?period=${period}`} className="text-xs text-indigo-300 hover:text-indigo-200">Tous les sites →</Link>}
          />
          <SiteTable rows={rows} period={period} />
        </Card>
        <Card>
          <CardHeader
            title="Points d'attention"
            subtitle={`${allAlerts.length} signaux détectés`}
            action={<Link href="/alertes" className="text-xs text-indigo-300 hover:text-indigo-200">Centre d&apos;alertes →</Link>}
          />
          <AlertList alerts={allAlerts.slice(0, 6)} compact />
        </Card>
      </div>

      <Card>
        <CardHeader title="Trajectoires comparées" subtitle="Indice de clics base 100 (moyenne de la période précédente) · par semaine" />
        <Base100Chart data={base100Series(period)} series={SITES.map((s) => ({ key: s.slug, name: s.name, color: s.color }))} />
      </Card>
    </>
  );
}
