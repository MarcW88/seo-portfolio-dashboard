import { notFound } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { ShareDonut } from "@/components/charts/ShareDonut";
import { BarsChart } from "@/components/charts/BarsChart";
import { PageTable } from "@/components/tables/PageTable";
import { parsePeriod, type PeriodSearchParams } from "@/lib/period";
import { getSite, getSiteDimensions, getSitePages } from "@/lib/data";

const DIM_COLORS = ["#818cf8", "#22d3ee", "#34d399", "#fbbf24", "#f472b6", "#a78bfa", "#fb7185", "#4ade80"];

export default async function SitePerformancesPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: PeriodSearchParams;
}) {
  const { siteId } = await params;
  const period = parsePeriod((await searchParams).period);
  const site = await getSite(siteId);
  if (!site) notFound();
  const [pages, dims] = await Promise.all([getSitePages(siteId, period), getSiteDimensions(siteId, period)]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <CardHeader title="Pages" subtitle="Tri, recherche, pagination et export CSV à venir" />
        <PageTable rows={pages} />
      </Card>
      <Card>
        <CardHeader title="Pays" subtitle="Clics par pays" />
        {dims && dims.countries.length > 0 ? (
          <BarsChart
            data={dims.countries.map((c) => ({ label: c.name.toUpperCase(), clics: c.clicks }))}
            dataKey="clics"
            name="Clics"
            colors={DIM_COLORS}
          />
        ) : (
          <p className="text-sm text-slate-500">Pas encore de données</p>
        )}
      </Card>
      <Card>
        <CardHeader title="Appareils" />
        {dims && dims.devices.length > 0 ? (
          <ShareDonut
            data={dims.devices.map((d, i) => ({ name: d.name, value: d.clicks, color: DIM_COLORS[i % DIM_COLORS.length] }))}
            centerLabel="clics"
          />
        ) : (
          <p className="text-sm text-slate-500">Pas encore de données</p>
        )}
      </Card>
      <Card>
        <CardHeader title="Types de recherche" />
        {dims && dims.searchTypes.length > 0 ? (
          <ShareDonut
            data={dims.searchTypes.map((d, i) => ({ name: d.name, value: d.clicks, color: DIM_COLORS[i % DIM_COLORS.length] }))}
            centerLabel="clics"
          />
        ) : (
          <p className="text-sm text-slate-500">Pas encore de données</p>
        )}
      </Card>
    </div>
  );
}
