"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PERIODS, parsePeriod } from "@/lib/period";

export function PeriodSwitch() {
  const pathname = usePathname();
  const current = parsePeriod(useSearchParams().get("period") ?? undefined);
  return (
    <div className="hidden items-center rounded-full bg-white/5 p-1 ring-1 ring-white/10 md:flex">
      {PERIODS.map((p) => (
        <Link
          key={p}
          href={`${pathname}?period=${p}`}
          scroll={false}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            current === p ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
          }`}
        >
          {p}j
        </Link>
      ))}
    </div>
  );
}
