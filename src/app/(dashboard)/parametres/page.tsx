import { Activity, BellRing, Database, Globe } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Block } from "@/components/ui/Block";
import { SITES } from "@/lib/mock/data";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Paramètres" description="Sites, connexions, règles d'alerte et santé des données" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Sites et sources"
            subtitle="Correspondance site ↔ propriété GSC ↔ dataset BigQuery (exemples)"
            action={<span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-900">+ Ajouter un site</span>}
          />
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="px-5 pb-3 font-medium">Site</th>
                  <th className="pb-3 font-medium">Propriété GSC</th>
                  <th className="pb-3 font-medium">Dataset BigQuery</th>
                  <th className="pb-3 pr-5 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {SITES.map((s, i) => (
                  <tr key={s.slug} className="border-t border-white/[0.05]">
                    <td className="px-5 py-2.5 text-white">{s.name}</td>
                    <td className="py-2.5 font-mono text-xs text-slate-400">sc-domain:{s.domain}</td>
                    <td className="py-2.5 font-mono text-xs text-slate-400">gsc_{s.slug.replace(/-/g, "_")}</td>
                    <td className="py-2.5 pr-5">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${i === SITES.length - 1 ? "text-amber-300" : "text-emerald-300"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${i === SITES.length - 1 ? "bg-amber-400" : "bg-emerald-400"}`} />
                        {i === SITES.length - 1 ? "Export en retard" : "À jour"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Block icon={Database} title="Connexions" items={["BigQuery (test d'accès au dataset)", "GitHub (V2)", "URL Inspection API (V2)"]} />
        <Block icon={BellRing} title="Règles d'alerte" items={["Seuils et volumes minimum par site", "Activation / désactivation, notifications e-mail"]} />
        <Block icon={Activity} title="Santé des données" items={["Dernier export par dataset (ExportLog)", "Historique des synchronisations"]} />
        <Block icon={Globe} title="Préférences" items={["Pays et type de recherche par défaut", "Langue de l'interface"]} />
      </div>
    </>
  );
}
