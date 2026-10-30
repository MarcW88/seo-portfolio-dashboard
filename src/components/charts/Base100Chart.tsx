"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, gridProps, tooltipProps } from "./theme";

type Series = { key: string; name: string; color: string };

export function Base100Chart({ data, series }: { data: Record<string, number | string>[]; series: Series[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} domain={["auto", "auto"]} />
        <ReferenceLine y={100} stroke="rgba(255,255,255,0.25)" strokeDasharray="3 3" />
        <Tooltip {...tooltipProps} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
