import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, GitCompare } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusPill } from "@/components/ui/Card";
import { getSite } from "@/lib/mock/data";
import { SiteTabs } from "./SiteTabs";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const site = getSite(siteId);
  if (!site) notFound();
  return (
    <>
      <Link href="/sites" className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <ArrowLeft size={14} /> Mes sites
      </Link>
      <PageHeader
        eyebrow={
          <>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: site.color, boxShadow: `0 0 12px ${site.color}` }} />
            <StatusPill tone="mock">Données fictives</StatusPill>
          </>
        }
        title={site.name}
        description={site.domain}
        actions={
          <div className="flex gap-2">
            <a
              href={`https://${site.domain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-slate-300 ring-1 ring-white/10 hover:bg-white/5"
            >
              <ExternalLink size={13} /> Ouvrir le site
            </a>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-900">
              <GitCompare size={13} /> Comparer au portefeuille
            </span>
          </div>
        }
      />
      <Suspense>
        <SiteTabs siteId={siteId} />
      </Suspense>
      {children}
    </>
  );
}
