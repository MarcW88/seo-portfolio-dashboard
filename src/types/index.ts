export type SearchType = "WEB" | "IMAGE" | "VIDEO" | "NEWS" | "DISCOVER" | "GOOGLE_NEWS";
export type Device = "DESKTOP" | "MOBILE" | "TABLET";

export type Site = {
  id: string;
  slug: string;
  name: string;
  domain: string;
  status: "active" | "paused" | "archived";
  bigqueryDataset?: string;
  gscProperty?: string;
  githubRepo?: string;
};

export type PeriodFilter = {
  start: string;
  end: string;
  compare: "previous" | "year" | "none";
  siteIds?: string[];
  country?: string;
  device?: Device;
  searchType: SearchType;
};

export type RawMetrics = {
  clicks: number;
  impressions: number;
  positionSum: number;
};

export type Metrics = {
  clicks: number;
  impressions: number;
  ctr: number | null;
  avgPosition: number | null;
};

export type AlertSeverity = "critical" | "warning" | "opportunity" | "positive";
export type AlertStatus = "open" | "acknowledged" | "resolved" | "dismissed";

export type AlertEvent = {
  id: string;
  siteId: string;
  ruleType: string;
  severity: AlertSeverity;
  status: AlertStatus;
  detectedAt: string;
  url?: string;
  observed: number;
  reference: number;
};
