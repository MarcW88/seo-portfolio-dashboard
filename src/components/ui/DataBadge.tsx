import { StatusPill } from "@/components/ui/Card";
import { isLive } from "@/lib/data";

export function DataBadge() {
  return isLive ? <StatusPill tone="live">Données réelles · BigQuery</StatusPill> : <StatusPill tone="mock">Données fictives</StatusPill>;
}
