import { BigQuery } from "@google-cloud/bigquery";

const bq = new BigQuery({ projectId: "seo-search-console-central", location: "eu" });

async function main() {
  const [rows] = await bq.query({
    query: `SELECT data_date, COUNT(*) n
            FROM \`seo-search-console-central.searchconsole_bloc_notes_numeriques.searchdata_site_impression\`
            GROUP BY data_date ORDER BY data_date DESC LIMIT 5`,
    location: "eu",
  });
  console.log("Dernières dates bloc-notes:");
  for (const r of rows) console.log(" ", r.data_date?.value ?? r.data_date, "→", r.n, "lignes");

  const [log] = await bq.query({
    query: `SELECT * FROM \`seo-search-console-central.searchconsole_bloc_notes_numeriques.ExportLog\`
            ORDER BY event_time DESC LIMIT 3`,
    location: "eu",
  });
  console.log("ExportLog:", JSON.stringify(log, null, 1).slice(0, 1500));
}

main().catch((e) => console.error(e.message));
