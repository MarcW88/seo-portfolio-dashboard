import { Card, CardHeader } from "@/components/ui/Card";
import { PageTable } from "@/components/tables/PageTable";
import { parsePeriod, type PeriodSearchParams } from "@/lib/period";
import { sitePages } from "@/lib/mock/data";

export default async function SiteContentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: PeriodSearchParams;
}) {
  const { siteId } = await params;
  const period = parsePeriod((await searchParams).period);
  const pages = sitePages(siteId, period);
  const byDelta = [...pages].sort((a, b) => b.clicks - b.prevClicks - (a.clicks - a.prevClicks));
  const opportunities = pages.filter((p) => p.position > 3 && p.position <= 10).sort((a, b) => b.impressions - a.impressions);
  const lowCtr = [...pages].sort((a, b) => a.ctr - b.ctr).filter((p) => p.impressions > 1000);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader title="Pages gagnantes" subtitle="Plus fortes progressions de clics" />
        <PageTable rows={byDelta.slice(0, 6)} />
      </Card>
      <Card>
        <CardHeader title="Pages perdantes" subtitle="Plus fortes baisses" />
        <PageTable rows={byDelta.slice(-6).reverse()} />
      </Card>
      <Card>
        <CardHeader title="Opportunités top 3" subtitle="Positions 4–10, triées par impressions" />
        <PageTable rows={opportunities.slice(0, 6)} />
      </Card>
      <Card>
        <CardHeader title="CTR à optimiser" subtitle="Beaucoup d'impressions, peu de clics" />
        <PageTable rows={lowCtr.slice(0, 6)} />
      </Card>
    </div>
  );
}
