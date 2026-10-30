"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, gridProps, tooltipProps } from "./theme";

export function BarsChart({
  data,
  dataKey,
  colors,
  height = 220,
  name,
}: {
  data: Record<string, number | string>[];
  dataKey: string;
  colors: string[];
  height?: number;
  name?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} allowDecimals={false} />
        <Tooltip {...tooltipProps} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey={dataKey} name={name} radius={[8, 8, 0, 0]} maxBarSize={48}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
