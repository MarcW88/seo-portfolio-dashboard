/**
 * Audit en lecture seule des datasets BigQuery.
 * Liste les datasets, tables, et la fraîcheur des exports GSC.
 *
 * Usage: npx tsx scripts/inspect-bigquery.ts
 */
import { BigQuery } from "@google-cloud/bigquery";

const projectId = process.env.GCP_PROJECT ?? "seo-search-console-central";
const location = process.env.BQ_LOCATION ?? "eu";
const bq = new BigQuery({ projectId, location });

async function main() {
  const [datasets] = await bq.getDatasets({ all: true });
  const gsc = datasets.filter((d) => d.id?.startsWith("searchconsole_"));
  if (gsc.length === 0) {
    console.log("Aucun dataset GSC trouvé.");
    return;
  }
  console.log(`\n=== ${gsc.length} dataset(s) GSC dans ${projectId} (${location}) ===\n`);

  for (const ds of gsc) {
    const [tables] = await ds.getTables();
    const names = tables.map((t) => t.id);
    console.log(`📁 ${ds.id} — ${tables.length} table(s): ${names.join(", ") || "(aucune)"}`);

    for (const name of names) {
      if (name === "searchdata_site_impression") {
        try {
          const [rows] = await ds.table(name).query({
            query: `SELECT MIN(data_date) AS first_date, MAX(data_date) AS last_date,
                           COUNT(*) AS n_rows, COUNT(DISTINCT site_url) AS n_sites,
                           SUM(clicks) AS clicks, SUM(impressions) AS impressions
                    FROM \`${projectId}.${ds.id}.searchdata_site_impression\``,
            location,
          });
          const r = rows[0];
          console.log(
            `   site_impression: ${r.first_date?.value ?? r.first_date} → ${r.last_date?.value ?? r.last_date}` +
              ` | ${r.n_rows} lignes | ${r.n_sites} propriété(s) | ${r.clicks} clics, ${r.impressions} imp.`,
          );
        } catch (e) {
          console.log(`   site_impression: ⚠ ${(e as Error).message.slice(0, 120)}`);
        }
      }
      if (name === "searchdata_url_impression") {
        try {
          const [rows] = await ds.table(name).query({
            query: `SELECT MAX(data_date) AS last_date, COUNT(DISTINCT url) AS n_urls
                    FROM \`${projectId}.${ds.id}.searchdata_url_impression\``,
            location,
          });
          console.log(`   url_impression:  → ${rows[0].last_date?.value ?? rows[0].last_date} | ${rows[0].n_urls} URL`);
        } catch (e) {
          console.log(`   url_impression:  ⚠ ${(e as Error).message.slice(0, 120)}`);
        }
      }
    }
    console.log();
  }
}

main().catch((e) => {
  console.error("Échec:", e.message);
  process.exit(1);
});
