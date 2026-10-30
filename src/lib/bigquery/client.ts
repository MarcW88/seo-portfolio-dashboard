import { BigQuery } from "@google-cloud/bigquery";

// Charge .env.local quand le module est utilisé hors Next (scripts tsx)
try {
  process.loadEnvFile(".env.local");
} catch {
  /* ignoré */
}

const projectId = process.env.GCP_PROJECT ?? "seo-search-console-central";
const location = process.env.BQ_LOCATION ?? "eu";

export function isBigQueryConfigured() {
  return Boolean(process.env.GCP_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

let client: BigQuery | null = null;

export function getBigQuery() {
  if (!client) {
    const raw = process.env.GCP_SERVICE_ACCOUNT_JSON;
    client = raw
      ? new BigQuery({ projectId, location, credentials: JSON.parse(raw) })
      : new BigQuery({ projectId, location });
  }
  return client;
}

export const BQ_PROJECT = projectId;
export const BQ_LOCATION = location;

// Les noms de datasets ne peuvent pas être paramétrés : validation stricte avant interpolation.
export function assertDatasetId(id: string) {
  if (!/^[a-zA-Z0-9_]+$/.test(id)) throw new Error(`Dataset invalide: ${id}`);
  return id;
}
