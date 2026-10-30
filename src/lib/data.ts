import { isBigQueryConfigured } from "@/lib/bigquery/client";
import * as bq from "@/lib/bigquery/queries";
import * as mock from "@/lib/mock/data";
import { compare, sparkline, trendSeries, base100Series, type DailyPoint } from "@/lib/analytics/series";
import { siteOverrides, SITE_COLORS } from "@/config/sites";
import type { MockAlert } from "@/lib/mock/data";

export { compare, trendSeries, sparkline, base100Series };
export type { DailyPoint };
export type { PageRow } from "@/lib/mock/data";

export type SiteMeta = {
  slug: string;
  name: string;
  domain: string;
  color: string;
  country: string;
  dataset?: string;
  lastDataDate?: string | null;
  rowCount?: number;
};

export const isLive = isBigQueryConfigured();

// ---------- registre des sites ----------

function titleize(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getSites(): Promise<SiteMeta[]> {
  if (!isLive) {
    return mock.SITES.map((s) => ({ slug: s.slug, name: s.name, domain: s.domain, color: s.color, country: s.country }));
  }
  const discovered = await bq.discoverSites();
  return discovered.map((s, i) => ({
    slug: s.slug,
    name: siteOverrides[s.slug]?.name ?? titleize(s.slug),
    domain: siteOverrides[s.slug]?.domain ?? s.domain ?? `${s.slug}`,
    color: SITE_COLORS[i % SITE_COLORS.length],
    country: siteOverrides[s.slug]?.country ?? (s.domain?.endsWith(".nl") ? "NL" : s.domain?.endsWith(".be") ? "BE" : "FR"),
    dataset: s.dataset,
    lastDataDate: s.lastDataDate,
    rowCount: s.rowCount,
  }));
}

export async function getSite(slug: string): Promise<(SiteMeta & { daily: DailyPoint[] }) | undefined> {
  const sites = await getSites();
  const meta = sites.find((s) => s.slug === slug);
  if (!meta) return undefined;
  return { ...meta, daily: await getSiteDaily(slug) };
}

// ---------- séries temporelles ----------

const datasetsBySlug = new Map<string, string>();
async function datasetFor(slug: string) {
  if (!datasetsBySlug.has(slug)) {
    for (const s of await getSites()) if (s.dataset) datasetsBySlug.set(s.slug, s.dataset);
  }
  const ds = datasetsBySlug.get(slug);
  if (!ds) throw new Error(`Site inconnu: ${slug}`);
  return ds;
}

export async function getSiteDaily(slug: string): Promise<DailyPoint[]> {
  if (!isLive) return mock.getSite(slug)?.daily ?? [];
  return bq.siteDaily(await datasetFor(slug));
}

export async function getPortfolioDaily(): Promise<DailyPoint[]> {
  if (!isLive) return mock.portfolioDaily();
  const sites = await getSites();
  const all = await Promise.all(sites.map((s) => getSiteDaily(s.slug)));
  if (!all.length || !all[0].length) return [];
  const dates = [...new Set(all.flatMap((d) => d.map((p) => p.date)))].sort();
  const byDate = new Map(dates.map((d) => [d, { date: d, clicks: 0, impressions: 0, positionSum: 0 }]));
  for (const daily of all)
    for (const p of daily) {
      const row = byDate.get(p.date)!;
      row.clicks += p.clicks;
      row.impressions += p.impressions;
      row.positionSum += p.positionSum;
    }
  return [...byDate.values()];
}

// ---------- tableau de bord ----------

export async function getSiteRows(period: number) {
  if (!isLive)
    return mock.siteRows(period).map((r) => ({
      ...r,
      dataset: undefined as string | undefined,
      lastDataDate: null as string | null,
      rowCount: 1 as number,
    }));
  const sites = await getSites();
  const rows = await Promise.all(
    sites.map(async (s) => {
      const daily = await getSiteDaily(s.slug);
      return { ...s, daily, ...compare(daily, period), spark: sparkline(daily, period) };
    }),
  );
  return rows.sort((a, b) => b.current.clicks - a.current.clicks);
}

export async function getBase100(period: number) {
  if (!isLive) return mock.base100Series(period);
  const sites = await getSites();
  const withDaily = await Promise.all(sites.map(async (s) => ({ slug: s.slug, daily: await getSiteDaily(s.slug) })));
  return base100Series(withDaily, period);
}

// ---------- pages ----------

export async function getSitePages(slug: string, period: number): Promise<mock.PageRow[]> {
  if (!isLive) return mock.sitePages(slug, period);
  const daily = await getSiteDaily(slug);
  return bq.sitePages(await datasetFor(slug), daily, period);
}

export async function getAllPages(period: number) {
  if (!isLive) return mock.allPages(period);
  const sites = await getSites();
  const out = await Promise.all(
    sites.map(async (s) =>
      (await getSitePages(s.slug, period)).map((p) => ({ ...p, site: s.name, siteSlug: s.slug, color: s.color })),
    ),
  );
  return out.flat();
}

export async function getPositionBuckets(slug: string, period: number) {
  const pages = await getSitePages(slug, period);
  const buckets = [
    { label: "Top 3", min: 0, max: 3 },
    { label: "4–10", min: 3, max: 10 },
    { label: "11–20", min: 10, max: 20 },
    { label: "21+", min: 20, max: Infinity },
  ];
  return buckets.map((b) => ({ label: b.label, pages: pages.filter((p) => p.position > b.min && p.position <= b.max).length }));
}

// ---------- dimensions ----------

export async function getSiteDimensions(slug: string, period: number) {
  if (!isLive) return null;
  const daily = await getSiteDaily(slug);
  return bq.siteDimensions(await datasetFor(slug), daily, period);
}

// ---------- alertes ----------

export async function getAlerts(period: number): Promise<MockAlert[]> {
  if (!isLive) return mock.alerts(period);
  const out: MockAlert[] = [];
  const rows = await getSiteRows(period);
  for (const s of rows) {
    const ch = s.change.clicks;
    if (s.rowCount === 0 || s.daily.length === 0) {
      out.push({ id: `empty-${s.slug}`, severity: "warning", title: "Aucune donnée reçue", detail: "Export GSC configuré mais vide", site: s.name, siteSlug: s.slug, date: "—" });
      continue;
    }
    const last = s.lastDataDate ? new Date(s.lastDataDate) : null;
    if (last && Date.now() - last.getTime() > 3 * 24 * 3600 * 1000) {
      out.push({ id: `stale-${s.slug}`, severity: "warning", title: "Export BigQuery en retard", detail: `Dernière journée : ${s.lastDataDate}`, site: s.name, siteSlug: s.slug, date: s.lastDataDate ?? "—" });
    }
    if (ch !== null && ch <= -25 && s.previous.clicks >= 50) {
      out.push({ id: `drop-${s.slug}`, severity: "critical", title: "Baisse de clics inhabituelle", detail: `${ch.toFixed(1)} % vs période précédente`, site: s.name, siteSlug: s.slug, date: "en cours" });
    } else if (ch !== null && ch >= 50 && s.previous.clicks >= 10) {
      out.push({ id: `up-${s.slug}`, severity: "positive", title: "Croissance forte", detail: `+${ch.toFixed(1)} % de clics`, site: s.name, siteSlug: s.slug, date: "en cours" });
    }
    if (s.change.position !== null && s.change.position > 3 && s.previous.impressions >= 500) {
      out.push({ id: `pos-${s.slug}`, severity: "warning", title: "Perte de positions", detail: `+${s.change.position.toFixed(1)} places en moyenne`, site: s.name, siteSlug: s.slug, date: "en cours" });
    }
    const opp = (await getSitePages(s.slug, period)).filter((p) => p.position > 3 && p.position <= 10 && p.impressions > 500).length;
    if (opp > 0) {
      out.push({ id: `opp-${s.slug}`, severity: "opportunity", title: `${opp} page${opp > 1 ? "s" : ""} en positions 4–10`, detail: "Volume d'impressions significatif, potentiel top 3", site: s.name, siteSlug: s.slug, date: "en cours" });
    }
  }
  const order = { critical: 0, warning: 1, opportunity: 2, positive: 3 };
  return out.sort((a, b) => order[a.severity] - order[b.severity]);
}

// ---------- indexation (mock tant que le module V2 n'est pas collecté) ----------

export function getIndexation(slug: string) {
  return mock.indexationMock(slug);
}
