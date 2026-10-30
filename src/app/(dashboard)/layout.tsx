import { Suspense } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { alerts } from "@/lib/mock/data";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const openAlerts = alerts(28).filter((a) => a.severity === "critical" || a.severity === "warning").length;
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[480px] w-[480px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>
      <Suspense>
        <TopNav alertCount={openAlerts} />
      </Suspense>
      <main className="mx-auto max-w-[1500px] px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
