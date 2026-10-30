"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { mainNav, settingsNav } from "@/config/navigation";
import { PeriodSwitch } from "./PeriodSwitch";

export function TopNav({ alertCount }: { alertCount: number }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const query = params.get("period") ? `?period=${params.get("period")}` : "";
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0b0d14]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center gap-6 px-4 py-3 md:px-8">
        <Link href={`/${query}`} className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 via-violet-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
            S
          </span>
          <span className="hidden text-sm font-semibold text-white sm:block">SEO Portfolio</span>
        </Link>

        <nav className="no-scrollbar -mx-2 flex flex-1 items-center gap-1 overflow-x-auto px-2">
          {mainNav.map(({ label, href, icon: Icon, status }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={`${href}${query}`}
                className={`relative flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm transition ${
                  active
                    ? "bg-white/10 text-white ring-1 ring-white/15"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <Icon size={15} />
                {label}
                {href === "/alertes" && alertCount > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                    {alertCount}
                  </span>
                )}
                {status && (
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">{status}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <PeriodSwitch />
          <Link
            href={settingsNav.href}
            aria-label={settingsNav.label}
            className={`grid h-9 w-9 place-items-center rounded-full transition ${
              isActive(settingsNav.href) ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <settingsNav.icon size={16} />
          </Link>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-xs font-semibold text-white ring-1 ring-white/10">
            M
          </span>
        </div>
      </div>
    </header>
  );
}
