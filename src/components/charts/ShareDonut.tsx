"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fmtCompact, fmtInt } from "@/lib/format";
import { tooltipProps } from "./theme";

type Slice = { name: string; value: number; color: string };

export function ShareDonut({ data, centerLabel }: { data: Slice[]; centerLabel: string }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col 2xl:flex-row">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius="68%" outerRadius="100%" paddingAngle={2} stroke="none">
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip {...tooltipProps} formatter={(v) => fmtInt(Number(v))} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-white">{fmtCompact(total)}</span>
          <span className="text-[11px] text-slate-400">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full space-y-2 text-xs">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="flex-1 truncate text-slate-300">{d.name}</span>
            <span className="tabular-nums text-slate-400">{((d.value / total) * 100).toFixed(0)} %</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
