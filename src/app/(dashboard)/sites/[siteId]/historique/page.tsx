import { GitCommit, PenLine, Rocket, LineChart } from "lucide-react";
import { Card, CardHeader, StatusPill } from "@/components/ui/Card";

const EVENTS = [
  { date: "28 nov.", icon: LineChart, color: "#34d399", title: "Bilan de l'intervention", detail: "Comparaison avant / après sur les URL concernées" },
  { date: "7 nov.", icon: LineChart, color: "#22d3ee", title: "Premiers signaux", detail: "Hausse des impressions sur les 3 articles réécrits" },
  { date: "31 oct.", icon: Rocket, color: "#818cf8", title: "Déploiement GitHub", detail: "Mise en production du lot éditorial · main@a3f9c1e" },
  { date: "29 oct.", icon: PenLine, color: "#f472b6", title: "Optimisation éditoriale", detail: "Réécriture de 3 articles, maillage interne renforcé" },
  { date: "12 oct.", icon: GitCommit, color: "#fbbf24", title: "Correctif technique", detail: "Canonicals des pages catégories" },
];

export default function SiteHistoryPage() {
  return (
    <Card>
      <CardHeader
        title="Chronologie des interventions"
        subtitle="Scénario illustratif · connexion GitHub prévue en V2"
        action={<StatusPill tone="v2">V2</StatusPill>}
      />
      <ol className="relative ml-3 border-l border-white/10">
        {EVENTS.map((e) => (
          <li key={e.title} className="mb-6 ml-6 last:mb-0">
            <span
              className="absolute -left-3.5 grid h-7 w-7 place-items-center rounded-full ring-4 ring-[#0b0d14]"
              style={{ background: `${e.color}22`, color: e.color }}
            >
              <e.icon size={13} />
            </span>
            <p className="text-xs text-slate-500">{e.date}</p>
            <p className="text-sm font-medium text-white">{e.title}</p>
            <p className="text-sm text-slate-400">{e.detail}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
