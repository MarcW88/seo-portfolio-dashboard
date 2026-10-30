export const axisProps = {
  stroke: "#475569",
  tick: { fill: "#64748b", fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

export const gridProps = { stroke: "rgba(255,255,255,0.06)", vertical: false } as const;

export const tooltipProps = {
  contentStyle: {
    background: "rgba(15,17,26,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    fontSize: 12,
    color: "#e2e8f0",
  },
  labelStyle: { color: "#94a3b8", marginBottom: 4 },
  cursor: { stroke: "rgba(255,255,255,0.15)" },
} as const;
