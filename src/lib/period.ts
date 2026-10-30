export const PERIODS = [7, 28, 90] as const;
export type Period = (typeof PERIODS)[number];

export function parsePeriod(value?: string | string[]): Period {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return (PERIODS as readonly number[]).includes(n) ? (n as Period) : 28;
}

export type PeriodSearchParams = Promise<{ period?: string | string[] }>;
