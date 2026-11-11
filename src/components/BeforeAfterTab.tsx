import { useState, type FormEvent } from "react";
import { CNAE_EXAMPLES, type AppliedImprovements, type computeImpact } from "../data/mockData";

interface BeforeAfterTabProps {
  applied: AppliedImprovements;
  impact: ReturnType<typeof computeImpact>;
  onGoToRecommendations: () => void;
}

function formatIban(raw: string): string {
  const cleaned = raw
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 24);
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

export function BeforeAfterTab({ applied, impact, onGoToRecommendations }: BeforeAfterTabProps) {
  const [beforeStatus, setBeforeStatus] = useState<string | null>(null);
  const [afterEntity, setAfterEntity] = useState<"autonomo" | "pyme">("autonomo");
  const [afterIban, setAfterIban] = useState("ES91 2100 0418 4502 0005 1332");
  const [cnaeSearch, setCnaeSearch] = useState("tienda");
  const [selectedCnae, setSelectedCnae] = useState("4791");
  const [afterStatus, setAfterStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleBeforeTest = (e: FormEvent) => {
    e.preventDefault();
    setBeforeStatus(
      "Envío bloqueado: IBAN con espacios no admitido, código CNAE sin ayuda y falta Escritura de Constitución (obligatoria incluso para autónomos).",
    );
  };

  const handleAfterTest = (e: FormEvent) => {
    e.preventDefault();
    const pending: string[] = [];
    const normalizedIban = afterIban.replace(/\s+/g, "").toUpperCase();
    if (!/^ES\d{22}$/.test(normalizedIban)) {
      pending.push("El código IBAN debe empezar por ES seguido de 22 dígitos.");
    } else if (!applied.sug2 && afterIban.includes(" ")) {
      pending.push("Activa Mejora #2 (IBAN) o elimina los espacios manualmente.");
    }
    if (!applied.sug1 && afterEntity === "autonomo") {
      pending.push("Activa Mejora #1 para eximir la Escritura a autónomos.");
    }
    if (!applied.cert) pending.push("Activa Mejora #4 para validar vigencia <90 días.");

    if (pending.length > 0) {
      setAfterStatus({ ok: false, msg: pending.join(" ") });
    } else {
      setAfterStatus({
        ok: true,
        msg: "Solicitud validada al primer intento sin llamadas a soporte técnico.",
      });
    }
  };

  const matchingCnae = CNAE_EXAMPLES.filter(
    (item) =>
      item.code.includes(cnaeSearch) || item.label.toLowerCase().includes(cnaeSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Comparativa de Impacto: Antes vs. Después
          </h2>
          <p className="text-xs text-slate-500">
            Demostración visual e interactiva del formulario ciudadano tras aplicar las mejoras GC
          </p>
        </div>
        {impact.activeCount < 4 && (
          <button
            type="button"
            onClick={onGoToRecommendations}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Configurar mejoras ({impact.activeCount}/4)
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* ANTES */}
        <form
          onSubmit={handleBeforeTest}
          className="space-y-3 rounded-xl border border-red-200 bg-white p-5 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
              ANTES · Formulario heredado
            </span>
            <span className="text-xs font-semibold text-red-700">41,2% éxito</span>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              IBAN (sin formato ni ayuda)
            </label>
            <input
              type="text"
              readOnly
              value="ES91 21000418 450200051332"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
            />
            <p className="mt-0.5 text-[11px] text-red-600">
              Rechaza espacios al enviar sin avisar antes.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Código CNAE (lista numérica sin descripción)
            </label>
            <select
              disabled
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
            >
              <option>4791 (¿Comercio o software?)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Escritura de Constitución (obligatoria para todos)
            </label>
            <div className="rounded-lg border border-dashed border-red-300 bg-red-50/50 px-3 py-2 text-xs text-red-800">
              Obligatorio incluso si eres autónomo. Sin aviso de formato PDF.
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg border border-red-300 bg-red-50 py-2 text-xs font-semibold text-red-800 hover:bg-red-100"
          >
            Probar envío heredado
          </button>

          {beforeStatus && (
            <p className="rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-800">
              {beforeStatus}
            </p>
          )}
        </form>

        {/* DESPUÉS */}
        <form
          onSubmit={handleAfterTest}
          className="space-y-3 rounded-xl border border-emerald-200 bg-white p-5 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              DESPUÉS · Con mejoras GC ({impact.activeCount}/4)
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              {impact.firstAttemptSuccess.toFixed(1).replace(".", ",")}% éxito
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700">Tipo solicitante:</span>
            <button
              type="button"
              onClick={() => {
                setAfterEntity("autonomo");
                setAfterStatus(null);
              }}
              className={`rounded-md px-2.5 py-1 font-semibold ${
                afterEntity === "autonomo"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Autónomo
            </button>
            <button
              type="button"
              onClick={() => {
                setAfterEntity("pyme");
                setAfterStatus(null);
              }}
              className={`rounded-md px-2.5 py-1 font-semibold ${
                afterEntity === "pyme" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              Pyme / Sociedad
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="iban-ok">
              IBAN {applied.sug2 ? "(autocompletado activo)" : "(mejora #2 desactivada)"}
            </label>
            <input
              id="iban-ok"
              type="text"
              value={afterIban}
              onChange={(e) => {
                setAfterIban(applied.sug2 ? formatIban(e.target.value) : e.target.value);
                setAfterStatus(null);
              }}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
            />
            {applied.cert && (
              <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
                Aviso activo: Certificado bancario emitido en los últimos 90 días con sello.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="cnae-q">
              CNAE {applied.cnae ? "(buscador asistido activo)" : "(mejora #3 desactivada)"}
            </label>
            {applied.cnae && (
              <input
                id="cnae-q"
                type="text"
                value={cnaeSearch}
                onChange={(e) => setCnaeSearch(e.target.value)}
                placeholder="Buscar actividad (ej. tienda, software)..."
                className="mb-1.5 w-full rounded-lg border border-blue-200 bg-blue-50/40 px-2.5 py-1 text-xs"
              />
            )}
            <select
              value={selectedCnae}
              onChange={(e) => setSelectedCnae(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
            >
              {(applied.cnae && matchingCnae.length > 0 ? matchingCnae : CNAE_EXAMPLES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Escritura de Constitución
            </label>
            {applied.sug1 && afterEntity === "autonomo" ? (
              <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                Exento automáticamente para personas físicas / autónomos.
              </div>
            ) : (
              <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                {applied.sug1
                  ? "Pre-validador activo: solo PDF multipágina."
                  : "Requerida (activa Mejora #1 para eximir a autónomos)."}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Probar envío optimizado
          </button>

          {afterStatus && (
            <p
              className={`rounded-lg p-2.5 text-xs font-medium ${
                afterStatus.ok ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
              }`}
            >
              {afterStatus.msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
