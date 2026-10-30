import { pctChange, sumRaw, toMetrics } from "@/lib/analytics/metrics";
import type { DailyPoint } from "@/lib/mock/data";
import type { Metrics } from "@/types";

export type { DailyPoint };

export function windows(daily: DailyPoint[], days: number) {
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
    const p = previous[i] ? toMetrics(previous[i]) : null;
    return {
      label: new Date(`${d.date}T00:00:00Z`).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", timeZone: "UTC" }),
      clicks: m.clicks,
      impressions: m.impressions,
      ctr: m.ctr,
      position: m.avgPosition,
      prevClicks: p?.clicks ?? 0,
      prevImpressions: p?.impressions ?? 0,
      prevCtr: p?.ctr ?? null,
      prevPosition: p?.avgPosition ?? null,
    };
  });
}

export function sparkline(daily: DailyPoint[], days: number, key: "clicks" | "impressions" = "clicks") {
  const slice = daily.slice(-days);
  const step = Math.max(1, Math.floor(slice.length / 20));
  return slice.filter((_, i) => i % step === 0).map((d) => ({ v: d[key] }));
}

export function base100Series(
  sites: { slug: string; daily: DailyPoint[] }[],
  days: number,
): Record<string, number | string>[] {
  if (sites.length === 0) return [];
  const ref = sites.map((s) => sumRaw(s.daily.slice(-days * 2, -days)).clicks / days);
  const weeks = Math.ceil(days / 7);
  const span = Math.max(days, 7 * weeks);
  return Array.from({ length: weeks }, (_, w) => {
    const start = -span + w * 7;
    const row: Record<string, number | string> = { label: `S${w + 1}` };
    sites.forEach((s, i) => {
      const slice = s.daily.slice(Math.max(-s.daily.length, start), start + 7 || undefined);
      row[s.slug] = slice.length && ref[i] ? Math.round((sumRaw(slice).clicks / slice.length / ref[i]) * 100) : 0;
    });
    return row;
  });
}
