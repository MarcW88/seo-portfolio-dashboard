"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { siteTabs } from "@/config/navigation";

export function SiteTabs({ siteId }: { siteId: string }) {
  const pathname = usePathname();
  const period = useSearchParams().get("period");
  const base = `/sites/${siteId}`;
  return (
    <nav className="no-scrollbar mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-white/[0.03] p-1 ring-1 ring-white/[0.06] sm:inline-flex">
      {siteTabs.map((tab) => {
        const href = tab.segment ? `${base}/${tab.segment}` : base;
        const active = pathname === href;
        return (
          <Link
            key={tab.label}
            href={period ? `${href}?period=${period}` : href}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm transition ${
              active ? "bg-white/10 font-medium text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
