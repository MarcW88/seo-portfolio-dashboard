import type { Metrics, RawMetrics } from "@/types";

export function sumRaw(rows: RawMetrics[]): RawMetrics {
  return rows.reduce(
    (acc, r) => ({
      clicks: acc.clicks + r.clicks,
      impressions: acc.impressions + r.impressions,
      positionSum: acc.positionSum + r.positionSum,
    }),
    { clicks: 0, impressions: 0, positionSum: 0 },
  );
}

// GSC sum_position is zero-based: avg position = 1 + SUM(position_sum) / SUM(impressions)
export function toMetrics({ clicks, impressions, positionSum }: RawMetrics): Metrics {
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : null,
    avgPosition: impressions > 0 ? 1 + positionSum / impressions : null,
  };
}

export function pctChange(current: number, previous: number): number | null {
  return previous === 0 ? null : ((current - previous) / previous) * 100;
}

export function indexBase100(value: number, reference: number): number | null {
  return reference === 0 ? null : (value / reference) * 100;
}
