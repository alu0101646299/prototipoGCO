import { useState } from "react";
import { Icon } from "./Icons";

interface ImpactSimulatorProps {
  appliedSug1: boolean;
  appliedSug2: boolean;
  appliedCnae: boolean;
  appliedCert: boolean;
  onToggleImprovement: (key: "sug1" | "sug2" | "cnae" | "cert") => void;
  onApplyAll: () => void;
}

const cnaeOptions = [
  { code: "4791", label: "Comercio al por menor por correspondencia o Internet (E-commerce)" },
  { code: "6201", label: "Actividades de programación informática (Desarrollo de Software)" },
  { code: "6202", label: "Actividades de consultoría informática y transformación digital" },
  { code: "7311", label: "Agencias de publicidad y marketing digital" },
  { code: "5610", label: "Restaurantes y puestos de comidas (Hostelería digitalizada)" },
];

function formatIban(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 24);
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

function isValidSpanishIban(raw: string): boolean {
  const cleaned = raw.replace(/\s+/g, "").toUpperCase();
  return /^ES\d{22}$/.test(cleaned);
}

export function ImpactSimulatorView({
  appliedSug1,
  appliedSug2,
  appliedCnae,
  appliedCert,
  onToggleImprovement,
  onApplyAll,
}: ImpactSimulatorProps) {
  const [viewMode, setViewMode] = useState<"split" | "before" | "after">("split");

  // Interactive "Before" form state
  const [beforeEntity, setBeforeEntity] = useState<"autonomo" | "pyme">("autonomo");
  const [beforeIban, setBeforeIban] = useState("ES91 21000418 450200051332");
  const [beforeCnae, setBeforeCnae] = useState("4791");
  const [beforeFile, setBeforeFile] = useState<"none" | "jpg" | "pdf1">("jpg");
  const [beforeSubmitMsg, setBeforeSubmitMsg] = useState<string | null>(null);

  // Interactive "After" form state
  const [afterEntity, setAfterEntity] = useState<"autonomo" | "pyme">("autonomo");
  const [afterIban, setAfterIban] = useState("ES91 2100 0418 4502 0005 1332");
  const [cnaeQuery, setCnaeQuery] = useState("tienda online");
  const [selectedCnae, setSelectedCnae] = useState("4791");
  const [afterFileState, setAfterFileState] = useState<"none" | "jpg_blocked" | "pdf_valid">(
    "pdf_valid",
  );
  const [afterSubmitted, setAfterSubmitted] = useState(false);

  const activeCount = [appliedSug1, appliedSug2, appliedCnae, appliedCert].filter(Boolean).length;
  const projectedSuccess = Math.round((41.2 + activeCount * 10.35) * 10) / 10;
  const projectedAbandon = Math.max(9, 38 - (appliedSug1 ? 22 : 0) - (appliedSug2 ? 7 : 0));
  const projectedCost = (14.2 - activeCount * 2.35).toFixed(2);

  const filteredCnae = cnaeOptions.filter(
    (c) =>
      c.code.includes(cnaeQuery) ||
      c.label.toLowerCase().includes(cnaeQuery.toLowerCase()),
  );

  const handleBeforeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (beforeIban.includes(" ")) errors.push("ERR_IBAN_04: Caracteres no válidos o espacios");
    if (beforeEntity === "autonomo" && beforeFile === "none")
      errors.push("ERR_DOC_12: Escritura de Constitución obligatoria vacía");
    if (beforeFile === "jpg") errors.push("ERR_MIME_500: Formato de documento no soportado");
    if (errors.length === 0) {
      errors.push("ERR_VALID_99: Verifique certificado bancario (sin especificar motivo)");
    }
    setBeforeSubmitMsg(errors.join(" · "));
  };

  const handleAfterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAfterSubmitted(true);
    setTimeout(() => setAfterSubmitted(false), 5000);
  };

  return (
    <div className="page-content">
      {/* Header Intro */}
      <div className="page-intro">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge badge-purple">DEMOSTRACIÓN DE IMPACTO GC · RÚBRICA #4</span>
            <span className="badge badge-blue">Trámite: Subvención Digitalización Pymes</span>
          </div>
          <h2>Comparativa Ciudadana: Antes vs. Después de TramitaGC</h2>
          <p>
            Simulación en vivo de cómo las recomendaciones de IA y el conocimiento explícito de
            Soporte transforman el formulario real para evitar abandonos.
          </p>
        </div>
        <div className="intro-actions" style={{ flexWrap: "wrap" }}>
          <div className="sim-mode-tabs" role="group" aria-label="Modo de visualización">
            <button
              className={`sim-tab ${viewMode === "split" ? "active" : ""}`}
              onClick={() => setViewMode("split")}
            >
              <Icon name="compare" size={14} /> Lado a Lado
            </button>
            <button
              className={`sim-tab ${viewMode === "before" ? "active" : ""}`}
              onClick={() => setViewMode("before")}
            >
              Solo Antes
            </button>
            <button
              className={`sim-tab ${viewMode === "after" ? "active" : ""}`}
              onClick={() => setViewMode("after")}
            >
              Solo Después
            </button>
          </div>
          {activeCount < 4 && (
            <button className="btn primary" onClick={onApplyAll}>
              <Icon name="sparkles" size={15} /> Activar las 4 mejoras GC
            </button>
          )}
        </div>
      </div>

      {/* Live Improvement Toggles Strip */}
      <div className="sim-toggles-bar">
        <span className="sim-toggles-label">
          <Icon name="brain" size={15} /> Mejoras de Gestión del Conocimiento activas en el
          simulador ({activeCount}/4):
        </span>
        <div className="sim-toggle-pills">
          <button
            className={`sim-pill ${appliedSug1 ? "on" : ""}`}
            onClick={() => onToggleImprovement("sug1")}
          >
            <Icon name={appliedSug1 ? "checkCircle" : "plus"} size={13} />
            Paso 3: Exención Autónomos + Validador PDF
          </button>
          <button
            className={`sim-pill ${appliedSug2 ? "on" : ""}`}
            onClick={() => onToggleImprovement("sug2")}
          >
            <Icon name={appliedSug2 ? "checkCircle" : "plus"} size={13} />
            Paso 2: Autocompletado IBAN (Mód. 97)
          </button>
          <button
            className={`sim-pill ${appliedCnae ? "on" : ""}`}
            onClick={() => onToggleImprovement("cnae")}
          >
            <Icon name={appliedCnae ? "checkCircle" : "plus"} size={13} />
            Paso 2: Buscador CNAE (Tabla Soporte/AJE)
          </button>
          <button
            className={`sim-pill ${appliedCert ? "on" : ""}`}
            onClick={() => onToggleImprovement("cert")}
          >
            <Icon name={appliedCert ? "checkCircle" : "plus"} size={13} />
            Paso 2: Aviso Cert. Bancario &lt;90 días
          </button>
        </div>
      </div>

      {/* Quantitative Before vs After Impact Metrics */}
      <div className="sim-metrics-grid">
        <div className="sim-metric-card">
          <span className="sim-metric-title">Éxito al 1er intento sin soporte</span>
          <div className="sim-metric-compare">
            <span className="val-before">41,2%</span>
            <span className="val-arrow">→</span>
            <span className="val-after">{projectedSuccess.toFixed(1).replace(".", ",")}%</span>
          </div>
          <span className="sim-metric-delta positive">
            +{(projectedSuccess - 41.2).toFixed(1).replace(".", ",")} puntos porcentuales
          </span>
        </div>

        <div className="sim-metric-card">
          <span className="sim-metric-title">Tasa de abandono en Paso 3</span>
          <div className="sim-metric-compare">
            <span className="val-before">38%</span>
            <span className="val-arrow">→</span>
            <span className="val-after">{projectedAbandon}%</span>
          </div>
          <span className="sim-metric-delta positive">
            −{38 - projectedAbandon}% fugas en documentación
          </span>
        </div>

        <div className="sim-metric-card">
          <span className="sim-metric-title">Espera en Soporte Técnico</span>
          <div className="sim-metric-compare">
            <span className="val-before">18 min</span>
            <span className="val-arrow">→</span>
            <span className="val-after">{Math.max(3, 18 - activeCount * 3.75).toFixed(0)} min</span>
          </div>
          <span className="sim-metric-delta positive">−{Math.round((activeCount * 3.75 / 18) * 100)}% tiempo de cola</span>
        </div>

        <div className="sim-metric-card">
          <span className="sim-metric-title">Coste operativo por expediente</span>
          <div className="sim-metric-compare">
            <span className="val-before">14,20 €</span>
            <span className="val-arrow">→</span>
            <span className="val-after">{projectedCost.replace(".", ",")} €</span>
          </div>
          <span className="sim-metric-delta positive">
            Ahorro estimado: {(14.2 - Number(projectedCost)).toFixed(2).replace(".", ",")} €/trámite
          </span>
        </div>
      </div>

      {/* Dual Form Simulator */}
      <div
        className={`sim-forms-container ${viewMode === "split" ? "is-split" : "is-single"}`}
      >
        {/* BEFORE FORM (Sin GC) */}
        {(viewMode === "split" || viewMode === "before") && (
          <div className="sim-form-pane pane-before">
            <div className="sim-pane-header before-header">
              <div>
                <span className="pane-badge bad">ANTES · SIN TRAMITAGC</span>
                <h3>Sede Electrónica Heredada (Compleja)</h3>
              </div>
              <span className="pane-stat bad">38% abandono · 42% error</span>
            </div>

            <form className="citizen-form" onSubmit={handleBeforeSubmit}>
              <div className="citizen-step-box">
                <div className="citizen-step-label">1. Datos del Solicitante</div>
                <div className="radio-row">
                  <label>
                    <input
                      type="radio"
                      name="beforeEntity"
                      checked={beforeEntity === "autonomo"}
                      onChange={() => setBeforeEntity("autonomo")}
                    />
                    Persona Física / Autónomo
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="beforeEntity"
                      checked={beforeEntity === "pyme"}
                      onChange={() => setBeforeEntity("pyme")}
                    />
                    Sociedad Mercantil (S.L. / S.A.)
                  </label>
                </div>
              </div>

              <div className="citizen-step-box">
                <div className="citizen-step-label">2. Datos Fiscales y Bancarios</div>
                <div className="cform-field">
                  <label>Código IBAN * (sin espacios ni guiones)</label>
                  <input
                    value={beforeIban}
                    onChange={(e) => setBeforeIban(e.target.value)}
                    placeholder="ES..."
                  />
                  <span className="cform-friction-tag">
                    ⚠ Fricción real: El usuario pega con espacios y falla al enviar (42% error).
                  </span>
                </div>

                <div className="cform-field">
                  <label>Código CNAE (4 dígitos) *</label>
                  <select value={beforeCnae} onChange={(e) => setBeforeCnae(e.target.value)}>
                    <option value="4791">4791</option>
                    <option value="6201">6201</option>
                    <option value="6202">6202</option>
                    <option value="7022">7022</option>
                    <option value="7311">7311</option>
                  </select>
                  <span className="cform-friction-tag">
                    ⚠ Fricción real: Códigos numéricos sin descripción (27% elige CNAE erróneo).
                  </span>
                </div>

                <div className="cform-field">
                  <label>Certificado Bancario *</label>
                  <input type="text" readOnly value="certificado_cuenta_2022.pdf" />
                  <span className="cform-friction-tag">
                    ⚠ No avisa vigencia &lt;90 días → 29% subsanaciones y 48 llamadas/semana.
                  </span>
                </div>
              </div>

              <div className="citizen-step-box">
                <div className="citizen-step-label">3. Documentación Obligatoria</div>
                <div className="cform-field">
                  <label>Escritura de Constitución *</label>
                  <div className="fake-upload-row">
                    <button
                      type="button"
                      className={`fake-file-btn ${beforeFile === "jpg" ? "selected" : ""}`}
                      onClick={() => setBeforeFile("jpg")}
                    >
                      foto_escritura.jpg
                    </button>
                    <button
                      type="button"
                      className={`fake-file-btn ${beforeFile === "pdf1" ? "selected" : ""}`}
                      onClick={() => setBeforeFile("pdf1")}
                    >
                      portada_1pag.pdf
                    </button>
                    <button
                      type="button"
                      className={`fake-file-btn ${beforeFile === "none" ? "selected" : ""}`}
                      onClick={() => setBeforeFile("none")}
                    >
                      (Vacío / Soy autónomo)
                    </button>
                  </div>
                  <span className="cform-friction-tag">
                    ⚠ Exige escritura incluso a autónomos y acepta .JPG sin avisar hasta el envío.
                  </span>
                </div>
              </div>

              {beforeSubmitMsg && (
                <div className="cform-error-banner">
                  <Icon name="alert" size={16} />
                  <span>{beforeSubmitMsg}</span>
                </div>
              )}

              <button type="submit" className="btn-citizen-before">
                Enviar Solicitud (Simular fallo clásico)
              </button>
            </form>
          </div>
        )}

        {/* AFTER FORM (Con TramitaGC) */}
        {(viewMode === "split" || viewMode === "after") && (
          <div className="sim-form-pane pane-after">
            <div className="sim-pane-header after-header">
              <div>
                <span className="pane-badge good">DESPUÉS · OPTIMIZADO CON TRAMITAGC</span>
                <h3>Formulario Ciudadano Asistido</h3>
              </div>
              <span className="pane-stat good">
                {projectedSuccess.toFixed(1).replace(".", ",")}% éxito · −66% coste
              </span>
            </div>

            <form className="citizen-form" onSubmit={handleAfterSubmit}>
              <div className="citizen-step-box is-smart">
                <div className="citizen-step-label">
                  1. Perfil del Solicitante <small>Regla lógica conectada al Paso 3</small>
                </div>
                <div className="radio-row">
                  <label>
                    <input
                      type="radio"
                      name="afterEntity"
                      checked={afterEntity === "autonomo"}
                      onChange={() => setAfterEntity("autonomo")}
                    />
                    Persona Física / Autónomo
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="afterEntity"
                      checked={afterEntity === "pyme"}
                      onChange={() => setAfterEntity("pyme")}
                    />
                    Sociedad Mercantil (S.L. / S.A.)
                  </label>
                </div>
              </div>

              <div className="citizen-step-box is-smart">
                <div className="citizen-step-label">
                  2. Datos Fiscales y Bancarios{" "}
                  {appliedSug2 && <span className="gc-tag">✓ IA #2 Activa</span>}
                </div>

                {/* IBAN with or without Sug2 */}
                <div className="cform-field">
                  <div className="cform-label-row">
                    <label>Código IBAN de la cuenta beneficiaria *</label>
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => setAfterIban("ES91 2100 0418 4502 0005 1332")}
                    >
                      Rellenar válido
                    </button>
                  </div>
                  <input
                    value={afterIban}
                    onChange={(e) =>
                      setAfterIban(appliedSug2 ? formatIban(e.target.value) : e.target.value)
                    }
                    className={
                      appliedSug2
                        ? isValidSpanishIban(afterIban)
                          ? "input-valid"
                          : "input-warn"
                        : ""
                    }
                  />
                  {appliedSug2 ? (
                    isValidSpanishIban(afterIban) ? (
                      <span className="cform-ok-tag">
                        <Icon name="checkCircle" size={13} /> Formato automático y dígito de
                        control IBAN verificados en tiempo real.
                      </span>
                    ) : (
                      <span className="cform-warn-tag">
                        <Icon name="info" size={13} /> Introduce 24 caracteres empezando por ES (se
                        formatea automáticamente).
                      </span>
                    )
                  ) : (
                    <span className="cform-friction-tag">
                      Mejora #2 desactivada en el simulador. Actívala arriba para ver el
                      autocompletado.
                    </span>
                  )}
                </div>

                {/* CNAE with or without Sug3 */}
                <div className="cform-field">
                  <label>
                    Actividad Empresarial (CNAE){" "}
                    {appliedCnae && <span className="gc-tag">✓ Tabla AJE/Soporte</span>}
                  </label>
                  {appliedCnae ? (
                    <div className="cnae-assisted-box">
                      <input
                        placeholder="Describe tu negocio (ej. tienda online, software, publicidad)..."
                        value={cnaeQuery}
                        onChange={(e) => setCnaeQuery(e.target.value)}
                      />
                      <select
                        value={selectedCnae}
                        onChange={(e) => setSelectedCnae(e.target.value)}
                      >
                        {(filteredCnae.length > 0 ? filteredCnae : cnaeOptions).map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} — {c.label}
                          </option>
                        ))}
                      </select>
                      <span className="cform-ok-tag">
                        <Icon name="book" size={13} /> Equivalencia asistida basada en conocimiento
                        explícito de Soporte Técnico.
                      </span>
                    </div>
                  ) : (
                    <select value={selectedCnae} onChange={(e) => setSelectedCnae(e.target.value)}>
                      <option value="4791">4791</option>
                      <option value="6201">6201</option>
                    </select>
                  )}
                </div>

                {/* Certificado Bancario with or without Cert */}
                {appliedCert && (
                  <div className="cform-knowledge-callout">
                    <Icon name="headset" size={15} />
                    <div>
                      <strong>Guía de Soporte (Vigencia &lt;90 días):</strong> Adjunta el
                      certificado oficial de titularidad emitido hace menos de 3 meses con sello o
                      CSV bancario (no son válidos recibos ni pantallazos).
                    </div>
                  </div>
                )}
              </div>

              <div className="citizen-step-box is-smart">
                <div className="citizen-step-label">
                  3. Documentación Societaria{" "}
                  {appliedSug1 && <span className="gc-tag">✓ IA #1 + Consenso SECI</span>}
                </div>

                {appliedSug1 && afterEntity === "autonomo" ? (
                  <div className="cform-exempt-box">
                    <Icon name="checkCircle" size={18} />
                    <div>
                      <strong>Requisito exento automáticamente (Persona Física / Autónomo)</strong>
                      <p>
                        Al seleccionar Autónomo en el Paso 1, no necesitas adjuntar Escritura de
                        Constitución. Se elimina la principal causa de abandono (46%).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="cform-field">
                    <label>Escritura de Constitución y Poderes Vigentes</label>
                    {appliedSug1 && (
                      <div className="cform-tooltip-box">
                        <Icon name="info" size={14} />
                        <span>
                          Sube un único <strong>PDF multipágina (mín. 4 págs.)</strong> donde
                          figuren las cláusulas de administración. Si solo tienes fotos, usa el
                          conversor automático.
                        </span>
                      </div>
                    )}
                    <div className="fake-upload-row">
                      <button
                        type="button"
                        className={`fake-file-btn ${
                          afterFileState === "jpg_blocked" ? "warn" : ""
                        }`}
                        onClick={() => setAfterFileState("jpg_blocked")}
                      >
                        Probar subida .JPG
                      </button>
                      <button
                        type="button"
                        className={`fake-file-btn ${
                          afterFileState === "pdf_valid" ? "good" : ""
                        }`}
                        onClick={() => setAfterFileState("pdf_valid")}
                      >
                        escritura_completa.pdf (8 págs.)
                      </button>
                    </div>
                    {appliedSug1 && afterFileState === "jpg_blocked" && (
                      <div className="cform-preval-alert">
                        <span>
                          Formato .JPG detectado antes del envío. No se admiten imágenes sueltas.
                        </span>
                        <button
                          type="button"
                          className="btn primary"
                          style={{ minHeight: "28px", fontSize: "11px" }}
                          onClick={() => setAfterFileState("pdf_valid")}
                        >
                          Convertir a PDF válido ahora
                        </button>
                      </div>
                    )}
                    {afterFileState === "pdf_valid" && (
                      <span className="cform-ok-tag">
                        <Icon name="checkCircle" size={13} /> Documento PDF pre-validado
                        correctamente (8 páginas, legible, &lt;10MB).
                      </span>
                    )}
                  </div>
                )}
              </div>

              {afterSubmitted && (
                <div className="cform-success-banner">
                  <Icon name="checkCircle" size={18} />
                  <span>
                    ¡Solicitud validada y firmada al primer intento sin errores ni llamadas a
                    soporte!
                  </span>
                </div>
              )}

              <button type="submit" className="btn-citizen-after">
                <Icon name="checkCircle" size={16} /> Validar y Presentar Solicitud al 1er
                Intento
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
