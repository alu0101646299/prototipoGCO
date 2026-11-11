import { Icon } from "./Icons";
import { intellectualCapitalData, stakeholderRoles } from "../data/mockData";
import type { StakeholderRoleId } from "../types/tramita";

export function AcademicProjectModal({
  isOpen,
  onClose,
  activeRole,
  onSelectRole,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeRole: StakeholderRoleId;
  onSelectRole: (roleId: StakeholderRoleId) => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="academic-modal-title"
    >
      <div className="modal-dialog" style={{ maxWidth: "820px" }}>
        <div className="modal-header">
          <div>
            <span className="badge badge-blue" style={{ marginBottom: "6px", display: "inline-block" }}>
              UNIVERSIDAD DE LA LAGUNA · ESIT · CURSO 2026-2027
            </span>
            <h3 id="academic-modal-title">
              TramitaGC — Ficha del Proyecto GCO y Matriz de Accionistas
            </h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Authors & Title */}
          <div className="academic-hero-box">
            <div>
              <strong>
                Sistema Inteligente de Analítica de Procesos y Gestión del Conocimiento para la
                Optimización de Trámites
              </strong>
              <p>
                Asignatura: <em>Gestión del Conocimiento en las Organizaciones</em> · Grado en
                Ingeniería Informática (ESIT - ULL)
              </p>
            </div>
            <div className="academic-authors">
              <span>
                <strong>Eduardo Cruz González</strong> · alu0101432748@ull.edu.es
              </span>
              <span>
                <strong>Álvaro Martín Pérez-Dionis</strong> · alu0101646299@ull.edu.es
              </span>
            </div>
          </div>

          {/* Interactive Power-Interest Matrix from PDF */}
          <div>
            <h4 className="modal-section-title">
              <Icon name="users" size={16} /> Matriz Poder-Interés de Accionistas (Haz clic en un
              rol para cambiar tu vista)
            </h4>
            <div className="power-interest-grid">
              <div className="pi-quadrant pi-q1">
                <div className="pi-head">
                  <strong>Menos Poder · Más Interés</strong>
                  <span>Mantener informados</span>
                </div>
                <p>
                  <strong>Aportan:</strong> Conocimiento de lo que no funciona.{" "}
                  <strong>Ofrecemos:</strong> Menor tasa de errores en trámites.
                </p>
                <div className="pi-chips">
                  <button
                    className={`pi-chip ${activeRole === "ciudadano" ? "selected" : ""}`}
                    onClick={() => {
                      onSelectRole("ciudadano");
                      onClose();
                    }}
                  >
                    <span className="dot" style={{ background: "#991b1b" }} /> Usuarios finales /
                    AJE Canarias
                  </button>
                  <span className="pi-chip static">
                    <span className="dot" style={{ background: "#db2777" }} /> Asociaciones de
                    consumidores
                  </span>
                </div>
              </div>

              <div className="pi-quadrant pi-q2">
                <div className="pi-head">
                  <strong>Más Poder · Más Interés</strong>
                  <span>Gestionar de cerca</span>
                </div>
                <p>
                  <strong>Aportan:</strong> Interés económico y datos.{" "}
                  <strong>Ofrecemos:</strong> Mejora de procesos y puntos de fallo.
                </p>
                <div className="pi-chips">
                  <button
                    className={`pi-chip ${activeRole === "gerencia" ? "selected" : ""}`}
                    onClick={() => {
                      onSelectRole("gerencia");
                      onClose();
                    }}
                  >
                    <span className="dot" style={{ background: "#0891b2" }} /> Gerencia de la
                    empresa
                  </button>
                  <button
                    className={`pi-chip ${activeRole === "tecnico" ? "selected" : ""}`}
                    onClick={() => {
                      onSelectRole("tecnico");
                      onClose();
                    }}
                  >
                    <span className="dot" style={{ background: "#2563eb" }} /> Personal técnico
                  </button>
                  <span className="pi-chip static">
                    <span className="dot" style={{ background: "#eab308" }} /> Empresas
                    adaptadoras
                  </span>
                </div>
              </div>

              <div className="pi-quadrant pi-q3">
                <div className="pi-head">
                  <strong>Menos Poder · Menos Interés</strong>
                  <span>Supervisar / Apoyar</span>
                </div>
                <p>
                  <strong>Aportan:</strong> Experiencia práctica diaria.{" "}
                  <strong>Ofrecemos:</strong> Reducción de carga de trabajo.
                </p>
                <div className="pi-chips">
                  <button
                    className={`pi-chip ${activeRole === "soporte" ? "selected" : ""}`}
                    onClick={() => {
                      onSelectRole("soporte");
                      onClose();
                    }}
                  >
                    <span className="dot" style={{ background: "#059669" }} /> Atención al cliente
                    / Soporte Técnico
                  </button>
                </div>
              </div>

              <div className="pi-quadrant pi-q4">
                <div className="pi-head">
                  <strong>Más Poder · Menos Interés</strong>
                  <span>Mantener satisfechos</span>
                </div>
                <p>
                  <strong>Aportan:</strong> Conocimiento normativo y requisitos.{" "}
                  <strong>Ofrecemos:</strong> Trazabilidad total.
                </p>
                <div className="pi-chips">
                  <button
                    className={`pi-chip ${activeRole === "gestor" ? "selected" : ""}`}
                    onClick={() => {
                      onSelectRole("gestor");
                      onClose();
                    }}
                  >
                    <span className="dot" style={{ background: "#dc2626" }} /> Encargados de los
                    trámites
                  </button>
                  <button
                    className={`pi-chip ${activeRole === "dpo" ? "selected" : ""}`}
                    onClick={() => {
                      onSelectRole("dpo");
                      onClose();
                    }}
                  >
                    <span className="dot" style={{ background: "#ea580c" }} /> Protección de datos
                    (DPO) y Reguladores
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Capital & Intangible Liabilities */}
          <div>
            <h4 className="modal-section-title">
              <Icon name="layers" size={16} /> Capital Intelectual y Mitigación de Pasivos
              Intangibles
            </h4>
            <div className="capital-grid">
              <div className="capital-card">
                <h5>Capital Humano</h5>
                <ul>
                  {intellectualCapitalData.humano.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="capital-card">
                <h5>Capital Estructural</h5>
                <ul>
                  {intellectualCapitalData.estructural.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="capital-card">
                <h5>Capital Relacional</h5>
                <ul>
                  {intellectualCapitalData.relacional.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "11px", color: "#64748b" }}>
            Rol actual activo en el simulador:{" "}
            <strong>
              {stakeholderRoles.find((r) => r.id === activeRole)?.label}
            </strong>{" "}
            — {stakeholderRoles.find((r) => r.id === activeRole)?.quadrant}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn primary" onClick={onClose}>
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
