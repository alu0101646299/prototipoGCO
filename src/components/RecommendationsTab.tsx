import { RECOMMENDATIONS, type AppliedImprovements, type ImprovementKey } from "../data/mockData";

interface RecommendationsTabProps {
  applied: AppliedImprovements;
  activeCount: number;
  onToggleImprovement: (key: ImprovementKey) => void;
  onGoToComparison: () => void;
}

export function RecommendationsTab({
  applied,
  activeCount,
  onToggleImprovement,
  onGoToComparison,
}: RecommendationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Motor de Recomendaciones</h2>
          <p className="text-xs text-slate-500">
            Sugerencias accionables generadas cruzando telemetría de errores y conocimiento de
            soporte
          </p>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onGoToComparison}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            Probar impacto en Antes vs. Después →
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {RECOMMENDATIONS.map((rec) => {
          const isApplied = applied[rec.key];
          return (
            <div
              key={rec.key}
              className={`flex flex-col justify-between rounded-xl border p-5 shadow-xs transition ${
                isApplied ? "border-emerald-300 bg-emerald-50/50" : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {rec.step}
                  </span>
                  <span className="text-[11px] font-semibold text-blue-700">{rec.impactLabel}</span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold text-slate-900">{rec.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{rec.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-500">Origen: {rec.seciOrigin}</span>
                <button
                  type="button"
                  onClick={() => onToggleImprovement(rec.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    isApplied
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {isApplied ? "Aplicada ✓" : "Aplicar mejora"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
