import { indexationMock } from "@/lib/mock/data";

export function IndexationSummary({ slug }: { slug: string }) {
  const { total, indexed, pending, issues } = indexationMock(slug);
  const parts = [
    { label: "Indexées", value: indexed, color: "bg-emerald-400" },
    { label: "À vérifier", value: pending, color: "bg-amber-400" },
    { label: "Anomalies", value: issues, color: "bg-rose-400" },
  ];
  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-white/5">
        {parts.map((p) => (
          <div key={p.label} className={p.color} style={{ width: `${(p.value / total) * 100}%` }} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {parts.map((p) => (
          <div key={p.label}>
            <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className={`h-1.5 w-1.5 rounded-full ${p.color}`} />
              {p.label}
            </p>
            <p className="mt-0.5 text-lg font-semibold text-white">{p.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">{total} URL inspectées · pas une couverture exhaustive</p>
    </div>
  );
}
