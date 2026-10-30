import { Card, CardHeader, StatusPill } from "@/components/ui/Card";
import { IndexationSummary } from "@/components/sites/IndexationSummary";
import { Block } from "@/components/ui/Block";
import { Clock, FileWarning, ListChecks, Unlink } from "lucide-react";

export default async function SiteIndexationPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader title="Synthèse" action={<StatusPill tone="v2">V2</StatusPill>} />
        <IndexationSummary slug={siteId} />
      </Card>
      <Block
        className="lg:col-span-2"
        icon={ListChecks}
        title="Liste des URL"
        items={["Statut Google, dernière inspection, type de problème", "Code HTTP, canonical, noindex, redirection"]}
      />
      <Block icon={Clock} title="Nouveaux contenus non indexés" items={["URL publiées sans indexation après N jours"]} />
      <Block icon={Unlink} title="URL désindexées" items={["URL auparavant indexées qui ne le sont plus"]} />
      <Block icon={FileWarning} title="Problèmes techniques" items={["HTTP 4xx/5xx, canonical, noindex, redirections"]} />
    </div>
  );
}
