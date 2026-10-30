import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, StatusPill } from "@/components/ui/Card";
import { AlertList, SEVERITY } from "@/components/alerts/AlertList";
import { parsePeriod, type PeriodSearchParams } from "@/lib/period";
import { alerts } from "@/lib/mock/data";

export default async function AlertsPage({ searchParams }: { searchParams: PeriodSearchParams }) {
  const period = parsePeriod((await searchParams).period);
  const all = alerts(period);
  const groups = (Object.keys(SEVERITY) as (keyof typeof SEVERITY)[]).map((k) => ({
    key: k,
    ...SEVERITY[k],
    items: all.filter((a) => a.severity === k),
  }));

  return (
    <>
      <PageHeader
        eyebrow={<StatusPill tone="mock">Données fictives</StatusPill>}
        title="Alertes"
        description="Ce qui nécessite ton attention, du plus urgent aux opportunités."
      />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {groups.map((g) => (
          <div key={g.key} className={`rounded-2xl p-4 ring-1 ${g.cls}`}>
            <div className="flex items-center gap-2 text-xs font-medium">
              <g.icon size={14} /> {g.label}
            </div>
            <p className="mt-2 text-3xl font-semibold text-white">{g.items.length}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {groups
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <Card key={g.key}>
              <CardHeader title={g.label} subtitle={`${g.items.length} alerte${g.items.length > 1 ? "s" : ""}`} />
              <AlertList alerts={g.items} />
            </Card>
          ))}
      </div>
    </>
  );
}
