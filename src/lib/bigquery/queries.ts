import { getBigQuery, BQ_PROJECT, BQ_LOCATION, assertDatasetId } from "./client";
import type { DailyPoint } from "@/lib/analytics/series";
import type { PageRow } from "@/lib/mock/data";

export type BqSite = {
  slug: string; // identifiant interne, ex. "cafetiere-italienne"
  dataset: string; // ex. "searchconsole_cafetiere_italienne"
  siteUrl: string | null; // propriété GSC, ex. "sc-domain:cafetiere-italienne.fr"
  domain: string | null;
  lastDataDate: string | null;
  rowCount: number;
};

// ---------- cache mémoire (serveur) ----------
const TTL = 5 * 60 * 1000;
const cache = new Map<string, { at: number; value: unknown }>();
function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as Promise<T>;
  const value = fn();
  cache.set(key, { at: Date.now(), value });
  return value;
}

async function run<T>(query: string, params: Record<string, unknown> = {}): Promise<T[]> {
  const [rows] = await getBigQuery().query({ query, params, location: BQ_LOCATION });
  return rows as T[];
}

const dsTable = (dataset: string, table: string) =>
  `\`${BQ_PROJECT}.${assertDatasetId(dataset)}.${table}\``;

// ---------- découverte des sites ----------
export function discoverSites(): Promise<BqSite[]> {
  return cached("sites", async () => {
    const bq = getBigQuery();
    const [datasets] = await bq.getDatasets({ all: true });
    const gsc = datasets.filter((d) => d.id?.startsWith("searchconsole_"));
    const sites = await Promise.all(
      gsc.map(async (d): Promise<BqSite> => {
        const dataset = d.id!;
        const slug = dataset.replace("searchconsole_", "").replace(/_/g, "-");
        try {
          const rows = await run<{ site_url: string | null; last: { value: string } | null; n: number }>(
            `SELECT ANY_VALUE(site_url) AS site_url, MAX(data_date) AS last, COUNT(*) AS n
             FROM ${dsTable(dataset, "searchdata_site_impression")}`,
          );
          const r = rows[0] ?? { site_url: null, last: null, n: 0 };
          const domain = r.site_url?.replace(/^sc-domain:/, "").replace(/^https?:\/\//, "").replace(/\/$/, "") ?? null;
          return { slug, dataset, siteUrl: r.site_url, domain, lastDataDate: r.last?.value ?? null, rowCount: r.n };
        } catch {
          return { slug, dataset, siteUrl: null, domain: null, lastDataDate: null, rowCount: 0 };
        }
      }),
    );
    return sites;
  });
}

// ---------- données quotidiennes d'un site ----------
export function siteDaily(dataset: string): Promise<DailyPoint[]> {
  return cached(`daily:${dataset}`, () =>
    run<{ date: { value: string } | string; clicks: number; impressions: number; position_sum: number }>(
      `SELECT data_date AS date,
              SUM(clicks) AS clicks,
              SUM(impressions) AS impressions,
              SUM(sum_top_position) AS position_sum
       FROM ${dsTable(dataset, "searchdata_site_impression")}
       WHERE search_type = 'WEB'
       GROUP BY data_date
       ORDER BY data_date`,
    ).then((rows) =>
      rows.map((r) => ({
        date: typeof r.date === "string" ? r.date : r.date.value,
        clicks: Number(r.clicks),
        impressions: Number(r.impressions),
        positionSum: Number(r.position_sum),
      })),
    ),
  );
}

// ---------- top URL d'un site sur une fenêtre ----------
function windowBounds(daily: DailyPoint[], days: number): { cur: [string, string]; prev: [string, string] } {
  const cur = daily.slice(-days);
  const prev = daily.slice(-days * 2, -days);
  return {
    cur: cur.length ? [cur[0].date, cur[cur.length - 1].date] : ["", ""],
    prev: prev.length ? [prev[0].date, prev[prev.length - 1].date] : ["", ""],
  };
}

export async function sitePages(dataset: string, daily: DailyPoint[], days: number): Promise<PageRow[]> {
  const { cur, prev } = windowBounds(daily, days);
  if (!cur[0]) return [];
  const [prevStart, prevEnd] = prev;
  const key = `pages:${dataset}:${cur[0]}:${cur[1]}:${prevStart}:${prevEnd}`;
  return cached(key, async () => {
    type Row = { url: string; clicks: number; prev: number; impressions: number; position_sum: number };
    const curCte = `cur AS (
         SELECT url, SUM(clicks) AS clicks, SUM(impressions) AS impressions, SUM(sum_position) AS psum
         FROM ${dsTable(dataset, "searchdata_url_impression")}
         WHERE search_type = 'WEB' AND data_date BETWEEN @curStart AND @curEnd
         GROUP BY url
       )`;
    const rows = prevStart
      ? await run<Row>(
          `WITH ${curCte}, prev AS (
             SELECT url, SUM(clicks) AS clicks
             FROM ${dsTable(dataset, "searchdata_url_impression")}
             WHERE search_type = 'WEB' AND data_date BETWEEN @prevStart AND @prevEnd
             GROUP BY url
           )
           SELECT c.url, c.clicks, IFNULL(p.clicks, 0) AS prev, c.impressions, c.psum AS position_sum
           FROM cur c LEFT JOIN prev p USING (url)
           ORDER BY c.clicks DESC, c.impressions DESC
           LIMIT 500`,
          { curStart: cur[0], curEnd: cur[1], prevStart, prevEnd },
        )
      : await run<Row>(
          `WITH ${curCte}
           SELECT c.url, c.clicks, 0 AS prev, c.impressions, c.psum AS position_sum
           FROM cur c
           ORDER BY c.clicks DESC, c.impressions DESC
           LIMIT 500`,
          { curStart: cur[0], curEnd: cur[1] },
        );
    return rows.map((r) => ({
      url: r.url,
      clicks: Number(r.clicks),
      prevClicks: Number(r.prev),
      impressions: Number(r.impressions),
      position: r.impressions > 0 ? 1 + Number(r.position_sum) / Number(r.impressions) : 0,
      ctr: r.impressions > 0 ? Number(r.clicks) / Number(r.impressions) : 0,
    }));
  });
}

// ---------- dimensions (pays, appareil, type de recherche) ----------
export type DimensionRow = { name: string; clicks: number };

export async function siteDimensions(
  dataset: string,
  daily: DailyPoint[],
  days: number,
): Promise<{ countries: DimensionRow[]; devices: DimensionRow[]; searchTypes: DimensionRow[] }> {
  const { cur } = windowBounds(daily, days);
  if (!cur[0]) return { countries: [], devices: [], searchTypes: [] };
  return cached(`dims:${dataset}:${cur[0]}:${cur[1]}`, async () => {
    const base = `FROM ${dsTable(dataset, "searchdata_site_impression")}
                  WHERE data_date BETWEEN @start AND @end`;
    const params = { start: cur[0], end: cur[1] };
    const byDim = async (dim: string, filter = "") =>
      (
        await run<{ name: string; clicks: number }>(
          `SELECT ${dim} AS name, SUM(clicks) AS clicks ${base} ${filter} GROUP BY name ORDER BY clicks DESC LIMIT 8`,
          params,
        )
      ).filter((r) => r.name !== null && Number(r.clicks) >= 0);
    const [countries, devices, searchTypes] = await Promise.all([
      byDim("country", "AND search_type = 'WEB'"),
      byDim("device", "AND search_type = 'WEB'"),
      byDim("search_type"),
    ]);
    return { countries, devices, searchTypes };
  });
}
