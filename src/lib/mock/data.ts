import { pctChange, sumRaw, toMetrics } from "@/lib/analytics/metrics";
import type { Metrics, RawMetrics } from "@/types";

// Données fictives déterministes, en attendant le branchement BigQuery.

export type DailyPoint = RawMetrics & { date: string };

export type MockSite = {
  slug: string;
  name: string;
  domain: string;
  color: string;
  country: string;
  daily: DailyPoint[];
};

export type PageRow = {
  url: string;
  clicks: number;
  prevClicks: number;
  impressions: number;
  position: number;
  ctr: number;
};

const HISTORY_DAYS = 200;
const END = new Date("2026-10-27T00:00:00Z");

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SITE_DEFS = [
  { slug: "cafetiere-italienne", name: "Cafetière italienne", domain: "cafetiere-italienne.fr", color: "#818cf8", country: "FR", base: 380, growth: 0.006, pos: 11.8, ctr: 0.021 },
  { slug: "bloc-notes-numeriques", name: "Bloc-notes numériques", domain: "bloc-notes-numeriques.fr", color: "#22d3ee", country: "FR", base: 280, growth: 0.003, pos: 14.2, ctr: 0.018 },
  { slug: "traitement-air", name: "Traitement air", domain: "traitement-air.fr", color: "#f472b6", country: "FR", base: 300, growth: -0.004, pos: 16.5, ctr: 0.015 },
  { slug: "aspirateurs-chantier", name: "Aspirateurs chantier", domain: "aspirateurs-chantier.fr", color: "#34d399", country: "FR", base: 120, growth: 0.011, pos: 13.1, ctr: 0.019 },
  { slug: "balkon-moestuin", name: "Balkon Moestuin", domain: "balkon-moestuin.nl", color: "#fbbf24", country: "NL", base: 35, growth: 0.016, pos: 19.4, ctr: 0.013 },
  { slug: "robots-piscine", name: "Robots piscine", domain: "robots-piscine.fr", color: "#a78bfa", country: "FR", base: 160, growth: -0.001, pos: 15.0, ctr: 0.017 },
];

function buildDaily(def: (typeof SITE_DEFS)[number], seed: number): DailyPoint[] {
  const r = rng(seed);
  return Array.from({ length: HISTORY_DAYS }, (_, i) => {
    const t = i - HISTORY_DAYS;
    const d = new Date(END);
    d.setUTCDate(d.getUTCDate() + t + 1);
    const weekly = [0.82, 1.05, 1.08, 1.06, 1.02, 0.95, 0.8][d.getUTCDay()];
    const trend = Math.exp(def.growth * (i - HISTORY_DAYS / 2) * 0.6);
    const noise = 0.85 + r() * 0.3;
    const clicks = Math.round(def.base * trend * weekly * noise);
    const ctr = def.ctr * (0.9 + r() * 0.2);
    const impressions = Math.round(clicks / ctr);
    const pos = Math.max(1.5, def.pos - def.growth * 120 * (i / HISTORY_DAYS) + (r() - 0.5) * 1.2);
    return { date: d.toISOString().slice(0, 10), clicks, impressions, positionSum: (pos - 1) * impressions };
  });
}

export const SITES: MockSite[] = SITE_DEFS.map((def, i) => ({
  slug: def.slug,
  name: def.name,
  domain: def.domain,
  color: def.color,
  country: def.country,
  daily: buildDaily(def, 42 + i * 97),
}));

export function getSite(slug: string) {
  return SITES.find((s) => s.slug === slug);
}

function windows(daily: DailyPoint[], days: number) {
  return { current: daily.slice(-days), previous: daily.slice(-days * 2, -days) };
}

export type Comparison = {
  current: Metrics;
  previous: Metrics;
  change: { clicks: number | null; impressions: number | null; ctr: number | null; position: number | null };
};

export function compare(daily: DailyPoint[], days: number): Comparison {
  const { current, previous } = windows(daily, days);
  const c = toMetrics(sumRaw(current));
  const p = toMetrics(sumRaw(previous));
  return {
    current: c,
    previous: p,
    change: {
      clicks: pctChange(c.clicks, p.clicks),
      impressions: pctChange(c.impressions, p.impressions),
      ctr: c.ctr !== null && p.ctr !== null ? (c.ctr - p.ctr) * 100 : null,
      position: c.avgPosition !== null && p.avgPosition !== null ? c.avgPosition - p.avgPosition : null,
    },
  };
}

export function portfolioDaily(sites: MockSite[] = SITES): DailyPoint[] {
  return sites[0].daily.map((d, i) => ({ date: d.date, ...sumRaw(sites.map((s) => s.daily[i])) }));
}

export type TrendPoint = {
  label: string;
  clicks: number;
  impressions: number;
  ctr: number | null;
  position: number | null;
  prevClicks: number;
  prevImpressions: number;
  prevCtr: number | null;
  prevPosition: number | null;
};

export function trendSeries(daily: DailyPoint[], days: number): TrendPoint[] {
  const { current, previous } = windows(daily, days);
  return current.map((d, i) => {
    const m = toMetrics(d);
    const p = toMetrics(previous[i]);
    return {
      label: new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      clicks: m.clicks,
      impressions: m.impressions,
      ctr: m.ctr,
      position: m.avgPosition,
      prevClicks: p.clicks,
      prevImpressions: p.impressions,
      prevCtr: p.ctr,
      prevPosition: p.avgPosition,
    };
  });
}

export function sparkline(daily: DailyPoint[], days: number, key: "clicks" | "impressions" = "clicks") {
  const slice = daily.slice(-days);
  const step = Math.max(1, Math.floor(slice.length / 20));
  return slice.filter((_, i) => i % step === 0).map((d) => ({ v: d[key] }));
}

export function siteRows(days: number) {
  return SITES.map((s) => ({ ...s, ...compare(s.daily, days), spark: sparkline(s.daily, days) })).sort(
    (a, b) => b.current.clicks - a.current.clicks,
  );
}

export function base100Series(days: number) {
  const ref = SITES.map((s) => sumRaw(s.daily.slice(-days * 2, -days)).clicks / days);
  const weeks = Math.ceil(days / 7);
  const span = Math.max(days, 7 * weeks);
  return Array.from({ length: weeks }, (_, w) => {
    const start = -span + w * 7;
    const row: Record<string, number | string> = { label: `S${w + 1}` };
    SITES.forEach((s, i) => {
      const slice = s.daily.slice(start, start + 7 || undefined);
      row[s.slug] = Math.round((sumRaw(slice).clicks / slice.length / ref[i]) * 100);
    });
    return row;
  });
}

const PAGE_TOPICS = [
  "meilleur-modele", "comparatif", "guide-achat", "avis", "entretien", "pas-cher", "top-10", "test-complet",
  "comment-choisir", "probleme-solution", "accessoires", "marques", "prix", "tuto", "alternative",
];

export function sitePages(slug: string, days: number): PageRow[] {
  const site = getSite(slug);
  if (!site) return [];
  const seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = rng(seed + days);
  const total = compare(site.daily, days).current.clicks;
  return PAGE_TOPICS.map((topic, i) => {
    const share = Math.pow(0.72, i) * (0.7 + r() * 0.6);
    const clicks = Math.round(total * share * 0.28);
    const prevClicks = Math.round(clicks * (0.55 + r() * 0.9));
    const position = Math.round((2 + i * 1.3 + r() * 6) * 10) / 10;
    const ctr = Math.max(0.004, 0.25 / position) * (0.8 + r() * 0.4);
    return { url: `https://${site.domain}/${topic}/`, clicks, prevClicks, impressions: Math.round(clicks / ctr), position, ctr };
  });
}

export function allPages(days: number) {
  return SITES.flatMap((s) => sitePages(s.slug, days).map((p) => ({ ...p, site: s.name, siteSlug: s.slug, color: s.color })));
}

export function positionBuckets(slug: string, days: number) {
  const pages = sitePages(slug, days);
  const buckets = [
    { label: "Top 3", min: 0, max: 3 },
    { label: "4–10", min: 3, max: 10 },
    { label: "11–20", min: 10, max: 20 },
    { label: "21+", min: 20, max: Infinity },
  ];
  return buckets.map((b) => ({
    label: b.label,
    pages: pages.filter((p) => p.position > b.min && p.position <= b.max).length,
  }));
}

export type MockAlert = {
  id: string;
  severity: "critical" | "warning" | "opportunity" | "positive";
  title: string;
  detail: string;
  site: string;
  siteSlug: string;
  date: string;
};

export function alerts(days: number): MockAlert[] {
  const out: MockAlert[] = [];
  for (const s of siteRows(days)) {
    const ch = s.change.clicks ?? 0;
    if (ch <= -10)
      out.push({ id: `drop-${s.slug}`, severity: "critical", title: "Baisse de clics inhabituelle", detail: `${ch.toFixed(1)} % vs période précédente`, site: s.name, siteSlug: s.slug, date: "27 oct." });
    else if (ch >= 25)
      out.push({ id: `up-${s.slug}`, severity: "positive", title: "Croissance forte", detail: `+${ch.toFixed(1)} % de clics`, site: s.name, siteSlug: s.slug, date: "27 oct." });
    if ((s.change.position ?? 0) > 0.8)
      out.push({ id: `pos-${s.slug}`, severity: "warning", title: "Perte de positions", detail: `+${s.change.position!.toFixed(1)} places en moyenne`, site: s.name, siteSlug: s.slug, date: "26 oct." });
    const opp = sitePages(s.slug, days).filter((p) => p.position > 3 && p.position <= 10 && p.impressions > 2000).length;
    if (opp > 0)
      out.push({ id: `opp-${s.slug}`, severity: "opportunity", title: `${opp} pages en positions 4–10`, detail: "Fort volume d'impressions, potentiel top 3", site: s.name, siteSlug: s.slug, date: "27 oct." });
  }
  out.push({ id: "export-robots", severity: "warning", title: "Export BigQuery en retard", detail: "Dernière journée reçue il y a 3 jours", site: "Robots piscine", siteSlug: "robots-piscine", date: "27 oct." });
  const order = { critical: 0, warning: 1, opportunity: 2, positive: 3 };
  return out.sort((a, b) => order[a.severity] - order[b.severity]);
}

export function indexationMock(slug: string) {
  const seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = rng(seed);
  const total = 80 + Math.round(r() * 220);
  const indexed = Math.round(total * (0.7 + r() * 0.25));
  const pending = Math.round((total - indexed) * 0.6);
  return { total, indexed, pending, issues: total - indexed - pending };
}
