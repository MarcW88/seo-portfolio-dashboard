const compact = new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("fr-FR");

export const fmtCompact = (n: number) => compact.format(n);
export const fmtInt = (n: number) => integer.format(n);
export const fmtCtr = (ctr: number | null) => (ctr === null ? "—" : `${(ctr * 100).toFixed(2).replace(".", ",")} %`);
export const fmtPos = (pos: number | null) => (pos === null ? "—" : pos.toFixed(1).replace(".", ","));

export function fmtDelta(value: number | null, unit: "%" | "pt" | "pl" = "%") {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const abs = Math.abs(value).toFixed(1).replace(".", ",");
  return unit === "%" ? `${sign}${abs} %` : unit === "pt" ? `${sign}${abs} pt` : `${sign}${abs} pl.`;
}
