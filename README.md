# SEO Portfolio Dashboard

Pilotage SEO de tous les sites depuis une seule interface (Next.js + Tailwind, déploiement Vercel).
Statut : interface complète alimentée par des données fictives (`src/lib/mock/data.ts`) — aucune source réelle connectée.

## Lancer

```bash
npm install
npm run dev   # http://localhost:3000
```

## Navigation

| Route | Rubrique | Statut |
| --- | --- | --- |
| `/` | Vue globale — KPIs, évolution, classement des sites, points d'attention | MVP |
| `/sites` | Mes sites — liste des sites | MVP |
| `/sites/[siteId]` | Fiche site — Vue d'ensemble | MVP |
| `/sites/[siteId]/performances` | Pages, requêtes, pays, appareils, types de recherche | MVP |
| `/sites/[siteId]/indexation` | URL indexées / non indexées / anomalies | V2 |
| `/sites/[siteId]/contenus` | Gagnantes, perdantes, opportunités, publications | MVP |
| `/sites/[siteId]/historique` | Interventions SEO, déploiements GitHub | V2 |
| `/contenus` | Pages & contenus — analyse transversale | MVP |
| `/alertes` | Centre d'alertes (critiques, à surveiller, opportunités) | MVP |
| `/indexation` | Synthèse indexation multi-sites | V2 |
| `/semantique` | Suivi sémantique (mots-clés, clusters, concurrents) | Futur |
| `/parametres` | Sites, connexions, règles d'alerte, santé des données | MVP |

## Arborescence

```
src/
├── app/
│   ├── layout.tsx                 # racine (html, fonts)
│   └── (dashboard)/
│       ├── layout.tsx             # sidebar + zone de contenu
│       ├── page.tsx               # Vue globale
│       ├── sites/
│       │   ├── page.tsx
│       │   └── [siteId]/
│       │       ├── layout.tsx     # en-tête + onglets du site
│       │       ├── SiteTabs.tsx
│       │       ├── page.tsx
│       │       ├── performances/ indexation/ contenus/ historique/
│       ├── contenus/ alertes/ indexation/ semantique/ parametres/
├── components/
│   ├── layout/   # TopNav (menu horizontal), PeriodSwitch (7/28/90j), PageHeader
│   ├── charts/   # TrendChart, Sparkline, ShareDonut, Base100Chart, BarsChart (Recharts)
│   ├── metrics/  # KpiCard
│   ├── sites/ tables/ alerts/
│   └── ui/       # Card, DeltaBadge, StatusPill, Block (placeholders V2/futur)
├── config/navigation.ts   # menu principal + onglets site
├── lib/
│   ├── analytics/metrics.ts   # CTR, position pondérée, variations, base 100
│   ├── mock/data.ts           # données fictives (à remplacer par BigQuery)
│   ├── period.ts              # gestion de la période (?period=7|28|90)
│   ├── bigquery/  database/  alerts/
└── types/index.ts
sql/{staging,marts,monitoring}/   # transformations BigQuery (dataset seo_portfolio)
supabase/migrations/              # base applicative (sites, sources, alertes)
```

## Règles de calcul

- CTR = Σ clics / Σ impressions
- Position moyenne = 1 + Σ sum_top_position / Σ impressions (jamais de moyenne de moyennes)
- Variation = (actuel − précédent) / précédent × 100, `null` si précédent = 0
