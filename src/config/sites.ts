// Surcharges optionnelles pour les sites découverts dans BigQuery.
// Clé = slug dérivé du dataset (searchconsole_<slug_avec_underscores> → tirets).
export const siteOverrides: Record<string, { name?: string; country?: string; domain?: string }> = {
  "aspirateurs-chantier": { name: "Aspirateurs chantier", country: "FR" },
  "balkon-moestuin": { name: "Balkon Moestuin", country: "NL" },
  "biologische-hondensnacks": { name: "Biologische Hondensnacks", country: "NL" },
  "bloc-notes-numeriques": { name: "Bloc-notes numériques", country: "FR" },
  "cafetiere-italienne": { name: "Cafetière italienne", country: "FR" },
  "haken-breien-shop": { name: "Haken Breien Shop", country: "NL" },
  "italiaanse-percolator": { name: "Italiaanse Percolator", country: "NL" },
  kastelenbelgie: { name: "Kastelen België", country: "BE" },
  "stations-electriques-portables": { name: "Stations électriques portables", country: "FR" },
  "thuisrenovatie-gids": { name: "Thuisrenovatie Gids", country: "NL" },
  "traitement-air": { name: "Traitement air", country: "FR" },
  "visite-musee": { name: "Visite Musée", country: "FR" },
};

export const SITE_COLORS = ["#818cf8", "#22d3ee", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#fb7185", "#4ade80", "#38bdf8", "#facc15", "#e879f9", "#2dd4bf"];
