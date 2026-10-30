import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataBadge } from "@/components/ui/DataBadge";
import { PageTable } from "@/components/tables/PageTable";
import { parsePeriod, type PeriodSearchParams } from "@/lib/period";
import { getAllPages } from "@/lib/data";

export default async function ContentsPage({ searchParams }: { searchParams: PeriodSearchParams }) {
  const period = parsePeriod((await searchParams).period);
  const pages = await getAllPages(period);
  const byDelta = [...pages].sort((a, b) => b.clicks - b.prevClicks - (a.clicks - a.prevClicks));
  const opportunities = pages.filter((p) => p.position > 3 && p.position <= 10).sort((a, b) => b.impressions - a.impressions);
  const rising = pages.filter((p) => p.prevClicks > 0 && p.clicks / p.prevClicks > 1.3).sort((a, b) => b.clicks / b.prevClicks - a.clicks / a.prevClicks);

  return (
    <>
      <PageHeader
        eyebrow={<DataBadge />}
        title="Pages & contenus"
        description={`${pages.length} URL analysées sur tous les sites · ${period} derniers jours`}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Pages gagnantes" subtitle="Plus fortes hausses de clics, tous sites" />
          <PageTable rows={byDelta.slice(0, 8)} showSite />
        </Card>
        <Card>
          <CardHeader title="Pages perdantes" subtitle="Plus fortes baisses de clics" />
          <PageTable rows={byDelta.slice(-8).reverse()} showSite />
        </Card>
        <Card>
          <CardHeader title="Opportunités" subtitle="Positions 4–10 avec impressions significatives" />
          <PageTable rows={opportunities.slice(0, 8)} showSite />
        </Card>
        <Card>
          <CardHeader title="Contenus en accélération" subtitle="+30 % de clics ou plus" />
          <PageTable rows={rising.slice(0, 8)} showSite />
        </Card>
      </div>
    </>
  );
}
