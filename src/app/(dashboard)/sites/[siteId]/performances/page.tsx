import { notFound } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { ShareDonut } from "@/components/charts/ShareDonut";
import { BarsChart } from "@/components/charts/BarsChart";
import { PageTable } from "@/components/tables/PageTable";
import { parsePeriod, type PeriodSearchParams } from "@/lib/period";
import { compare, getSite, sitePages } from "@/lib/mock/data";

export default async function SitePerformancesPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: PeriodSearchParams;
}) {
  const { siteId } = await params;
  const period = parsePeriod((await searchParams).period);
  const site = getSite(siteId) ?? notFound();
  const clicks = compare(site.daily, period).current.clicks;
  const labels = site.country === "NL" ? ["NL", "BE", "DE", "FR", "Autres"] : ["FR", "BE", "CH", "CA", "Autres"];
  const countries = labels.map((label, i) => ({
    label,
    clics: Math.round(clicks * [0.78, 0.09, 0.06, 0.04, 0.03][i]),
  }));
  const devices = [
    { name: "Mobile", value: Math.round(clicks * 0.64), color: "#818cf8" },
    { name: "Desktop", value: Math.round(clicks * 0.31), color: "#22d3ee" },
    { name: "Tablette", value: Math.round(clicks * 0.05), color: "#f472b6" },
  ];
  const searchTypes = [
    { name: "Web", value: Math.round(clicks * 0.9), color: "#34d399" },
    { name: "Image", value: Math.round(clicks * 0.07), color: "#fbbf24" },
    { name: "Discover", value: Math.round(clicks * 0.03), color: "#a78bfa" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <CardHeader title="Pages" subtitle="Tri, recherche, pagination et export CSV à venir" />
        <PageTable rows={sitePages(siteId, period)} />
      </Card>
      <Card>
        <CardHeader title="Pays" subtitle="Clics par pays" />
        <BarsChart data={countries} dataKey="clics" name="Clics" colors={[site.color, "#22d3ee", "#34d399", "#fbbf24", "#475569"]} />
      </Card>
      <Card>
        <CardHeader title="Appareils" />
        <ShareDonut data={devices} centerLabel="clics" />
      </Card>
      <Card>
        <CardHeader title="Types de recherche" />
        <ShareDonut data={searchTypes} centerLabel="clics" />
      </Card>
    </div>
  );
}
