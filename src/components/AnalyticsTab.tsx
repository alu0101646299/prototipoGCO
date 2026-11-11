import {
  CRITICAL_FIELDS,
  FUNNEL_STEPS,
  type AppliedImprovements,
  type computeImpact,
} from "../data/mockData";

interface AnalyticsTabProps {
  applied: AppliedImprovements;
  impact: ReturnType<typeof computeImpact>;
  onGoToRecommendations: () => void;
}

export function AnalyticsTab({ applied, impact, onGoToRecommendations }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Panel de Control y Embudo</h2>
          <p className="text-xs text-slate-500">
            Indicadores de proceso y organización para detectar cuellos de botella en el trámite
          </p>
        </div>
        {impact.activeCount < 4 && (
          <button
            type="button"
            onClick={onGoToRecommendations}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100"
          >
            Ver {4 - impact.activeCount} mejoras pendientes →
          </button>
        )}
      </div>

      {/* 4 KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Éxito al 1.er intento</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            {impact.firstAttemptSuccess.toFixed(1).replace(".", ",")}%
          </p>
          <p className="mt-1 text-xs text-slate-500">Base inicial: 41,2% sin asistencia</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Carga en soporte técnico</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">
            {impact.supportTicketsWeek} <span className="text-sm font-medium">tickets/sem</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Espera media: {impact.supportWaitMin.toFixed(1).replace(".", ",")} min (base 18,0)
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Coste por expediente</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">
            {impact.costPerFile.toFixed(2).replace(".", ",")} €
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {impact.annualSavingsEur > 0
              ? `Ahorro est.: ${impact.annualSavingsEur.toLocaleString("es-ES")} €/año`
              : "Base inicial: 14,20 €/expediente"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Mejoras implementadas</p>
          <p className="mt-1 text-2xl font-bold text-violet-700">{impact.activeCount} / 4</p>
          <p className="mt-1 text-xs text-slate-500">
            {impact.activeCount === 4
              ? "Trámite optimizado por completo"
              : "Actívalas en Recomendaciones"}
          </p>
        </div>
      </div>

      {/* Embudo + Tabla de puntos críticos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Embudo por etapas</h3>
          <p className="mb-4 text-xs text-slate-500">
            Conversión de usuarios en cada paso del formulario electrónico
          </p>
          <div className="space-y-3.5">
            {FUNNEL_STEPS.map((step) => {
              const conversion =
                step.number === 2
                  ? impact.step2Conversion
                  : step.number === 3
                    ? impact.step3Conversion
                    : step.baseConversion;
              const abandon = 100 - conversion;
              const isCritical = abandon >= 25;
              return (
                <div key={step.number} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {step.number}. {step.name}
                    </span>
                    <span
                      className={`font-semibold ${isCritical ? "text-red-600" : "text-slate-600"}`}
                    >
                      {conversion}% paso · {abandon}% abandono
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full transition-all ${
                        isCritical
                          ? "bg-red-500"
                          : abandon >= 15
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${conversion}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Tiempo medio: {step.avgTime} · {step.note}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">
            Campos y documentos con más errores u omisiones
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Patrones detectados antes de aplicar las mejoras de gestión del conocimiento
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-2 font-semibold">Campo / Documento</th>
                  <th className="py-2 pr-2 font-semibold">Error</th>
                  <th className="py-2 pr-2 font-semibold">Omisión</th>
                  <th className="py-2 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CRITICAL_FIELDS.map((field) => {
                  const allFixed = field.improvementKeys.every((k) => applied[k]);
                  const someFixed = field.improvementKeys.some((k) => applied[k]);
                  return (
                    <tr key={field.name}>
                      <td className="py-3 pr-2">
                        <p className="font-semibold text-slate-800">{field.name}</p>
                        <p className="text-[11px] text-slate-500">{field.step}</p>
                      </td>
                      <td className="py-3 pr-2 font-medium">{field.validationErrorPct}%</td>
                      <td className="py-3 pr-2 font-medium">{field.omittedDocPct}%</td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            allFixed
                              ? "bg-emerald-100 text-emerald-800"
                              : someFixed || field.status === "Revisar"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {allFixed ? "Mitigado" : someFixed ? "Parcial" : field.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
