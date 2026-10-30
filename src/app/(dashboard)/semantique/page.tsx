import { Crosshair, History, KeyRound, Layers, Radar, Swords } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusPill } from "@/components/ui/Card";
import { Block } from "@/components/ui/Block";

export default function SemanticPage() {
  return (
    <>
      <PageHeader
        eyebrow={<StatusPill tone="futur">Module futur</StatusPill>}
        title="Suivi sémantique"
        description="Rank tracking indépendant de GSC, rattaché aux mêmes identifiants de sites et d'URL."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Block icon={Radar} title="Dashboard visibilité" items={["Positions moyennes, part de voix, évolution"]} />
        <Block icon={KeyRound} title="Mots-clés suivis" items={["Mot-clé, pays, langue, appareil, URL cible, position"]} />
        <Block icon={Layers} title="Clusters" items={["Regroupements thématiques et intentions"]} />
        <Block icon={Swords} title="Concurrents" items={["Écarts de positionnement par cluster"]} />
        <Block icon={Crosshair} title="Cannibalisation" items={["Plusieurs URL sur un même mot-clé"]} />
        <Block icon={History} title="Historique des positions" items={["Évolution par mot-clé et par URL"]} />
      </div>
    </>
  );
}
