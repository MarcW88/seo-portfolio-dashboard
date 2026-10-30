import { BigQuery } from "@google-cloud/bigquery";

const projectId = process.env.GCP_PROJECT ?? "seo-search-console-central";
const bq = new BigQuery({ projectId });

async function main() {
  // Cherche les schémas (datasets) visibles dans les régions courantes
  for (const region of ["region-us", "region-eu"]) {
    try {
      const [rows] = await bq.query({
        query: `SELECT schema_name FROM \`${projectId}.${region}\`.INFORMATION_SCHEMA.SCHEMATA`,
        location: region.replace("region-", ""),
      });
      console.log(`${region}:`, rows.map((r) => r.schema_name).join(", ") || "(aucun)");
    } catch (e) {
      console.log(`${region}: ⚠ ${(e as Error).message.slice(0, 150)}`);
    }
  }

  // Listage via le SDK avec options
  try {
    const [datasets] = await bq.getDatasets({ all: true });
    console.log("getDatasets(all):", datasets.map((d) => d.id).join(", ") || "(aucun)");
  } catch (e) {
    console.log("getDatasets ÉCHOUÉ:", (e as Error).message.slice(0, 200));
  }
}

main();
