import { Bell, FileText, Globe, LayoutDashboard, ScanSearch, Settings, Sparkles, type LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  status?: "v2" | "futur";
};

export const mainNav: NavItem[] = [
  { label: "Vue globale", href: "/", icon: LayoutDashboard },
  { label: "Mes sites", href: "/sites", icon: Globe },
  { label: "Pages & contenus", href: "/contenus", icon: FileText },
  { label: "Alertes", href: "/alertes", icon: Bell },
  { label: "Indexation", href: "/indexation", icon: ScanSearch, status: "v2" },
  { label: "Sémantique", href: "/semantique", icon: Sparkles, status: "futur" },
];

export const settingsNav: NavItem = { label: "Paramètres", href: "/parametres", icon: Settings };

export const siteTabs = [
  { label: "Vue d'ensemble", segment: "" },
  { label: "Performances", segment: "performances" },
  { label: "Indexation", segment: "indexation" },
  { label: "Contenus", segment: "contenus" },
  { label: "Historique", segment: "historique" },
] as const;
