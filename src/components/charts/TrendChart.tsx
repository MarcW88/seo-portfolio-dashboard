"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/lib/mock/data";
import { fmtCompact, fmtCtr, fmtPos } from "@/lib/format";
import { axisProps, gridProps, tooltipProps } from "./theme";

const METRICS = {
  clicks: { label: "Clics", prev: "prevClicks", color: "#818cf8", fmt: (v: number) => fmtCompact(v), reversed: false },
  impressions: { label: "Impressions", prev: "prevImpressions", color: "#22d3ee", fmt: (v: number) => fmtCompact(v), reversed: false },
  ctr: { label: "CTR", prev: "prevCtr", color: "#34d399", fmt: (v: number) => fmtCtr(v), reversed: false },
  position: { label: "Position", prev: "prevPosition", color: "#fbbf24", fmt: (v: number) => fmtPos(v), reversed: true },
} as const;

type MetricKey = keyof typeof METRICS;

export function TrendChart({ data, height = 280 }: { data: TrendPoint[]; height?: number }) {
  const [metric, setMetric] = useState<MetricKey>("clicks");
  const m = METRICS[metric];
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-white/5 p-1">
          {(Object.keys(METRICS) as MetricKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setMetric(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                metric === k ? "bg-white/10 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {METRICS[k].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: m.color }} /> Période actuelle
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 border-t border-dashed border-slate-500" /> Période précédente
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id={`trend-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={m.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={m.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="label" {...axisProps} minTickGap={24} />
          <YAxis {...axisProps} reversed={m.reversed} tickFormatter={m.fmt} width={56} domain={["auto", "auto"]} />
          <Tooltip
            {...tooltipProps}
            formatter={(v, name) => [m.fmt(Number(v)), name === metric ? "Actuelle" : "Précédente"]}
          />
          <Line type="monotone" dataKey={m.prev} stroke="#64748b" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={m.color}
            strokeWidth={2.25}
            fill={`url(#trend-${metric})`}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
