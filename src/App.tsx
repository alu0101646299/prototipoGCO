import { useState, type ReactNode } from "react";
import { Icon } from "./components/Icons";
import { ImpactSimulatorView } from "./components/ImpactSimulatorView";
import { AcademicProjectModal } from "./components/AcademicProjectModal";
import { SeciModelCard } from "./components/SeciModelCard";
import {
  criticalFieldsData,
  environmentBenchmarks,
  initialThreads,
  intellectualCapitalData,
  procedureBreakdownTable,
  proceduresList,
  recommendationsCatalog,
  stakeholderRoles,
} from "./data/mockData";
import type {
  CommunityThread,
  CriticalField,
  IconName,
  SeciPhase,
  StakeholderRole,
  StakeholderRoleId,
} from "./types/tramita";

interface NavItem {
  label: string;
  sublabel?: string;
  icon: IconName;
  count?: number;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Panel de Control", icon: "grid" },
  { label: "Analítica de Trámites", sublabel: "y Embudos", icon: "funnel" },
  {
    label: "Simulador Antes vs.",
    sublabel: "Después (Ciudadano)",
    icon: "compare",
    badge: "DEMO",
  },
  { label: "Recomendaciones IA", icon: "sparkles", count: 5 },
  { label: "Comunidad y Modelo", sublabel: "SECI · Conocimiento", icon: "users" },
  { label: "Auditoría, Entorno", sublabel: "y Normativa", icon: "shield" },
];

function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "gray" | "purple";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast-notification" role="status" aria-live="polite">
      <Icon name="checkCircle" size={18} className="text-emerald-400" />
      <span>{message}</span>
      <button onClick={onClose} aria-label="Cerrar notificación">
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

function Header({
  title,
  eyebrow,
  onMenu,
  roleInfo,
  onOpenAcademic,
  onNavigate,
  searchQuery,
  onSearchChange,
}: {
  title: string;
  eyebrow: string;
  onMenu: () => void;
  roleInfo: StakeholderRole;
  onOpenAcademic: () => void;
  onNavigate: (tab: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    {
      title: "Cuello de botella crítico en Paso 3",
      desc: "38% de abandono por Escritura de Constitución (Subvención Pymes).",
      tab: 0,
    },
    {
      title: "Nuevo conocimiento explicitado (Soporte)",
      desc: "Laura M. validó la regla de vigencia <90 días para Certificado Bancario.",
      tab: 4,
    },
    {
      title: "Simulación Antes vs. Después lista",
      desc: "Comprueba el impacto real de las mejoras de IA sobre el formulario ciudadano.",
      tab: 2,
    },
  ];

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="icon-btn mobile-menu" onClick={onMenu} aria-label="Abrir menú">
          <Icon name="menu" />
        </button>
        <div>
          <div className="breadcrumb">
            {eyebrow} <span>/</span> {title}
          </div>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="header-actions">
        <button
          type="button"
          className="ull-pill-btn"
          onClick={onOpenAcademic}
          title="Ver ficha académica del proyecto GCO (ESIT - ULL) y Matriz de Accionistas"
        >
          <Icon name="award" size={15} />
          <span>ULL · GCO 26-27</span>
        </button>

        <label className="searchbox">
          <Icon name="search" size={18} />
          <input
            aria-label="Buscar en TramitaGC"
            placeholder="Filtrar hilos, campos, eventos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              style={{ border: 0, background: "none", color: "#64748b", padding: 0 }}
              aria-label="Limpiar búsqueda"
            >
              <Icon name="x" size={14} />
            </button>
          ) : (
            <kbd>⌘ K</kbd>
          )}
        </label>

        <div style={{ position: "relative" }}>
          <button
            className="icon-btn notification"
            aria-label="Notificaciones"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Icon name="bell" size={20} />
            <span />
          </button>
          {notifOpen && (
            <div className="notif-popover">
              <div className="notif-popover-head">
                <strong>Alertas Inteligentes GC</strong>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  style={{ border: 0, background: "none", color: "#64748b" }}
                >
                  <Icon name="x" size={14} />
                </button>
              </div>
              {notifications.map((n) => (
                <button
                  type="button"
                  key={n.title}
                  className="notif-item"
                  onClick={() => {
                    onNavigate(n.tab);
                    setNotifOpen(false);
                  }}
                >
                  <strong>{n.title}</strong>
                  <span>{n.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="avatar"
          onClick={onOpenAcademic}
          aria-label={`Perfil de ${roleInfo.userName}`}
          title={`${roleInfo.userName} · ${roleInfo.label}`}
          style={{ border: 0, cursor: "pointer" }}
        >
          {roleInfo.initials}
        </button>
      </div>
    </header>
  );
}

function Sidebar({
  active,
  setActive,
  open,
  setOpen,
  role,
  setRole,
  roleInfo,
  onOpenAcademic,
}: {
  active: number;
  setActive: (i: number) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  role: StakeholderRoleId;
  setRole: (r: StakeholderRoleId) => void;
  roleInfo: StakeholderRole;
  onOpenAcademic: () => void;
}) {
  return (
    <>
      {open && (
        <button
          className="sidebar-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        />
      )}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <span />
            <span />
            <span />
          </div>
          <span>
            Tramita<span>GC</span>
          </span>
          <button
            className="icon-btn sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <Icon name="x" />
          </button>
        </div>
        <div className="role-wrap">
          <label htmlFor="role">ROL / ACCIONISTA ACTIVO</label>
          <div className="role-select">
            <div className="role-icon" style={{ color: "#fff", background: roleInfo.color }}>
              <Icon name="users" size={16} />
            </div>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as StakeholderRoleId)}
            >
              {stakeholderRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={14} />
          </div>
          <div className="role-quadrant-mini">{roleInfo.quadrant}</div>
        </div>
        <nav aria-label="Navegación principal">
          <p className="nav-label">ESPACIO DE TRABAJO</p>
          {navItems.map((item, i) => (
            <button
              key={item.label}
              className={`nav-item ${active === i ? "active" : ""}`}
              onClick={() => {
                setActive(i);
                setOpen(false);
              }}
            >
              <Icon name={item.icon} size={19} />
              <span>
                {item.label}
                {item.sublabel && <small>{item.sublabel}</small>}
              </span>
              {item.count && <b>{item.count}</b>}
              {item.badge && <b className="nav-badge-demo">{item.badge}</b>}
            </button>
          ))}
        </nav>
        <button type="button" className="sidebar-help" onClick={onOpenAcademic}>
          <div className="help-icon">
            <Icon name="award" size={18} />
          </div>
          <div style={{ textAlign: "left" }}>
            <strong>Proyecto GCO · ULL</strong>
            <span>Matriz de accionistas y capital</span>
          </div>
          <Icon name="chevron" size={16} />
        </button>
        <div className="user-card">
          <div className="avatar small">{roleInfo.initials}</div>
          <div>
            <strong>{roleInfo.userName}</strong>
            <span>{roleInfo.userTitle}</span>
          </div>
          <button onClick={onOpenAcademic} aria-label="Información del perfil y proyecto">
            •••
          </button>
        </div>
      </aside>
    </>
  );
}

function RolePerspectiveBanner({
  roleInfo,
  onNavigate,
  onOpenAcademic,
}: {
  roleInfo: StakeholderRole;
  onNavigate: (tab: number) => void;
  onOpenAcademic: () => void;
}) {
  const quickTarget =
    roleInfo.id === "ciudadano"
      ? { label: "Ir al Simulador Ciudadano Antes/Después", tab: 2 }
      : roleInfo.id === "soporte"
        ? { label: "Registrar incidencia tácita (SECI)", tab: 4 }
        : roleInfo.id === "dpo"
          ? { label: "Revisar Auditoría ENS y RGPD", tab: 5 }
          : roleInfo.id === "tecnico"
            ? { label: "Ver reglas de validación y Staging", tab: 3 }
            : { label: "Ver Comparativa de Impacto Antes/Después", tab: 2 };

  return (
    <div className="role-perspective-banner">
      <div className="role-perspective-left">
        <span className="role-dot" style={{ background: roleInfo.color }} />
        <div>
          <div className="role-perspective-top">
            <strong>Perspectiva activa: {roleInfo.label}</strong>
            <span className="role-quadrant-tag">{roleInfo.quadrant}</span>
          </div>
          <p>
            <strong>Qué aporta:</strong> {roleInfo.contributes} · <strong>Qué obtiene:</strong>{" "}
            {roleInfo.receives}
          </p>
        </div>
      </div>
      <div className="role-perspective-actions">
        <button className="btn secondary" onClick={onOpenAcademic}>
          Matriz Poder-Interés
        </button>
        <button className="btn primary" onClick={() => onNavigate(quickTarget.tab)}>
          {quickTarget.label} <Icon name="chevron" size={14} />
        </button>
      </div>
    </div>
  );
}

function NewIncidentModal({
  isOpen,
  onClose,
  onSubmit,
  defaultRole,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (thread: Partial<CommunityThread>) => void;
  defaultRole: CommunityThread["authorRole"];
}) {
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("Laura M.");
  const [authorRole, setAuthorRole] = useState<CommunityThread["authorRole"]>(defaultRole);
  const [seciPhase, setSeciPhase] = useState<SeciPhase>("Exteriorización");
  const [step, setStep] = useState("Paso 3: Adjuntar Documentación");
  const [description, setDescription] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit({
      title,
      authorName,
      authorRole,
      seciPhase,
      description,
      knowledgeSnippet: proposedSolution
        ? `Propuesta de conocimiento explícito (${seciPhase}): "${proposedSolution}"`
        : undefined,
      tags: [step.split(":")[0], "Comunidad SECI", authorRole],
      status: "En debate con IA",
      repliesCount: 1,
      timeAgo: "Ahora mismo",
      replies: [
        {
          author: authorName,
          role: authorRole,
          text: description,
          time: "Ahora mismo",
        },
      ],
    });
    setTitle("");
    setDescription("");
    setProposedSolution("");
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-dialog">
        <div className="modal-header">
          <h3 id="modal-title">Compartir incidencia tácita o buena práctica (SECI)</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="inc-title">Título descriptivo del problema o práctica</label>
              <input
                id="inc-title"
                required
                placeholder="Ej.: Duda recurrente sobre firma electrónica en Safari / MacOS"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className="form-help-text">
                Define el síntoma principal que observas en la atención ciudadana o tramitación.
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label htmlFor="inc-author">Autor de la aportación</label>
                <input
                  id="inc-author"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="inc-role">Tu rol / área</label>
                <select
                  id="inc-role"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value as CommunityThread["authorRole"])}
                >
                  <option value="Soporte Técnico">Soporte Técnico (Atención)</option>
                  <option value="Gestor de Trámites">Gestor de Trámites (Instrucción)</option>
                  <option value="Asesoría Jurídica">Asesoría Jurídica / Normativa</option>
                  <option value="Personal Técnico">Personal Técnico (TI)</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label htmlFor="inc-step">Paso del trámite afectado</label>
                <select id="inc-step" value={step} onChange={(e) => setStep(e.target.value)}>
                  <option>Paso 1: Identificación</option>
                  <option>Paso 2: Datos Fiscales</option>
                  <option>Paso 3: Adjuntar Documentación</option>
                  <option>Paso 4: Firma y Envío</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="inc-seci">Fase del Modelo SECI</label>
                <select
                  id="inc-seci"
                  value={seciPhase}
                  onChange={(e) => setSeciPhase(e.target.value as SeciPhase)}
                >
                  <option value="Socialización">1. Socialización (Tácito → Tácito)</option>
                  <option value="Exteriorización">2. Exteriorización (Tácito → Explícito)</option>
                  <option value="Combinación">3. Combinación (Explícito → Explícito)</option>
                  <option value="Interiorización">4. Interiorización (Explícito → Tácito)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inc-desc">
                Descripción de la incidencia tácita (¿Qué está ocurriendo?)
              </label>
              <textarea
                id="inc-desc"
                required
                rows={3}
                placeholder="Explica qué dificultad encuentran los usuarios o gestores de forma recurrente..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inc-sol">
                Propuesta de conocimiento explícito (Para incorporar a la guía oficial)
              </label>
              <textarea
                id="inc-sol"
                rows={2}
                placeholder="Ej.: Redactar advertencia clara en la pantalla del paso 2 o actualizar la FAQ oficial..."
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn primary">
              <Icon name="share" size={15} /> Publicar en la comunidad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DebateModal({
  isOpen,
  onClose,
  onConsensus,
  currentUserLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConsensus: () => void;
  currentUserLabel: string;
}) {
  const [comment, setComment] = useState("");
  const [messages, setMessages] = useState([
    {
      author: "Laura M. (Soporte Técnico)",
      text: "El 46% de omisión de la Escritura de Constitución se concentra en autónomos que no tienen empresa constituida y se bloquean, o pymes que no saben cómo convertir el documento a PDF multipágina.",
      time: "Hoy, 09:30",
    },
    {
      author: "Carlos R. (Gestor de Trámites)",
      text: "Totalmente de acuerdo. Podemos añadir el tooltip propuesto por la IA y un enlace directo al conversor PDF. Además de marcar como exento automáticamente si en el Paso 1 eligió Persona Física.",
      time: "Hoy, 10:15",
    },
  ]);

  if (!isOpen) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        author: currentUserLabel,
        text: comment,
        time: "Ahora mismo",
      },
    ]);
    setComment("");
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="debate-title">
      <div className="modal-dialog">
        <div className="modal-header">
          <div>
            <h3 id="debate-title">Mesa de debate: Sugerencia IA #1 (Exteriorización SECI)</h3>
            <span style={{ fontSize: "11px", color: "#64748b" }}>
              Simplificar instrucción en Paso 3 (Escritura de Constitución)
            </span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              padding: "12px 14px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "12px",
              color: "#1e3a8a",
            }}
          >
            <strong>Objetivo de la propuesta:</strong> Eximir a autónomos, incorporar tooltip
            explicativo y activar pre-validación de formato PDF antes del envío en el Paso 3,
            reduciendo la omisión del 46% y el abandono del 38%.
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px 12px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#475569",
                    marginBottom: "4px",
                  }}
                >
                  <strong style={{ color: "#0f172a" }}>{m.author}</strong>
                  <span>{m.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#1e293b", lineHeight: 1.5 }}>
                  {m.text}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment}>
            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label htmlFor="debate-comment">Añadir aportación a la mesa de trabajo</label>
              <textarea
                id="debate-comment"
                rows={2}
                placeholder="Escribe tu observación técnica o normativa..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button type="submit" className="btn secondary" style={{ width: "100%" }}>
              <Icon name="message" size={15} /> Añadir respuesta
            </button>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cerrar
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              onConsensus();
              onClose();
            }}
          >
            <Icon name="checkCircle" size={15} /> Consensuar y aplicar en Simulador
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorDetailModal({
  field,
  onClose,
  onOpenSimulator,
}: {
  field: CriticalField | null;
  onClose: () => void;
  onOpenSimulator: () => void;
}) {
  if (!field) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="modal-dialog">
        <div className="modal-header">
          <div>
            <h3 id="detail-title">Diagnóstico detallado: {field.name}</h3>
            <span style={{ fontSize: "11px", color: "#64748b" }}>{field.step}</span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "12px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#991b1b", fontWeight: 700 }}>
                ERROR DE VALIDACIÓN
              </span>
              <div
                style={{ fontSize: "24px", fontWeight: 800, color: "#991b1b", marginTop: "4px" }}
              >
                {field.validationError}%
              </div>
              <span style={{ fontSize: "11px", color: "#7f1d1d" }}>
                Intentos fallidos al enviar el formulario
              </span>
            </div>
            <div
              style={{
                padding: "12px",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#92400e", fontWeight: 700 }}>
                DOCUMENTACIÓN OMITIDA
              </span>
              <div
                style={{ fontSize: "24px", fontWeight: 800, color: "#92400e", marginTop: "4px" }}
              >
                {field.omittedDoc}%
              </div>
              <span style={{ fontSize: "11px", color: "#78350f" }}>
                Expedientes incompletos requeridos
              </span>
            </div>
          </div>
          <div className="form-group">
            <label>Análisis de fricción ciudadana</label>
            <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.6, margin: 0 }}>
              {field.detail}
            </p>
          </div>
          <div
            style={{
              padding: "12px 14px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#166534",
            }}
          >
            <strong>Solución vinculada recomendada por IA:</strong>
            <div style={{ marginTop: "4px" }}>{field.solutionLinked}</div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn secondary"
            onClick={() => {
              onClose();
              onOpenSimulator();
            }}
          >
            <Icon name="compare" size={14} /> Probar solución en Simulador
          </button>
          <button type="button" className="btn primary" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

interface DashboardProps {
  roleInfo: StakeholderRole;
  activeProcedure: string;
  setActiveProcedure: (id: string) => void;
  appliedSug1: boolean;
  appliedSug2: boolean;
  onApplySug1: () => void;
  onApplySug2: () => void;
  threads: CommunityThread[];
  onOpenNewIncident: () => void;
  onOpenDebate: () => void;
  onAdvanceThreadSeci: (id: string) => void;
  onNavigate: (tab: number) => void;
  onOpenAcademic: () => void;
  triggerToast: (msg: string) => void;
  searchQuery: string;
}

function Dashboard({
  roleInfo,
  activeProcedure,
  setActiveProcedure,
  appliedSug1,
  appliedSug2,
  onApplySug1,
  onApplySug2,
  threads,
  onOpenNewIncident,
  onOpenDebate,
  onAdvanceThreadSeci,
  onNavigate,
  onOpenAcademic,
  triggerToast,
  searchQuery,
}: DashboardProps) {
  const [selectedStep, setSelectedStep] = useState<number>(3);
  const [filterStep, setFilterStep] = useState<number | "all">("all");
  const [dismissedSug2, setDismissedSug2] = useState<boolean>(false);
  const [selectedErrorField, setSelectedErrorField] = useState<CriticalField | null>(null);
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>("thread-1");
  const [communityFilter, setCommunityFilter] = useState<string>("all");
  const [seciFilter, setSeciFilter] = useState<SeciPhase | "all">("all");

  const currentProc = proceduresList.find((p) => p.id === activeProcedure) || proceduresList[0];

  // Dynamic KPI boost when AI suggestions are applied
  const bonusRate = (appliedSug1 ? 8.4 : 0) + (appliedSug2 ? 5.8 : 0);
  const effectiveFirstAttempt = Math.min(92, currentProc.firstAttemptSuccess + bonusRate);
  const effectiveTickets = Math.max(
    90,
    Math.round(currentProc.supportTicketsWeek * (1 - (appliedSug1 ? 0.25 : 0) - (appliedSug2 ? 0.14 : 0))),
  );
  const effectiveWait = Math.max(
    1.8,
    currentProc.supportWaitMin - (appliedSug1 ? 1.1 : 0) - (appliedSug2 ? 0.7 : 0),
  );
  const effectiveCost = Math.max(
    2.9,
    currentProc.costPerFile - (appliedSug1 ? 0.95 : 0) - (appliedSug2 ? 0.55 : 0),
  );
  const implementedCount = 14 + (appliedSug1 ? 1 : 0) + (appliedSug2 ? 1 : 0);
  const adoptionPct = Math.round((implementedCount / 19) * 100);

  const kpis = [
    {
      title: "Éxito al primer intento (sin soporte)",
      value: `${effectiveFirstAttempt.toFixed(1).replace(".", ",")}%`,
      change: bonusRate > 0 ? `+${(12.3 + bonusRate).toFixed(1).replace(".", ",")}%` : "+12,3%",
      note: bonusRate > 0 ? "con mejoras en Staging" : "vs. mes anterior",
      icon: "check" as IconName,
      color: "blue",
      up: true,
      highlight: roleInfo.id === "gestor" || roleInfo.id === "ciudadano",
    },
    {
      title: "Carga y espera en soporte técnico",
      value: `${effectiveTickets}`,
      suffix: `tickets/sem · ${effectiveWait.toFixed(1).replace(".", ",")} min espera`,
      change: "−24% tickets · −76% espera",
      note: "vs. línea base 18 min",
      icon: "headset" as IconName,
      color: "green",
      up: false,
      highlight: roleInfo.id === "soporte",
    },
    {
      title: "Coste operativo y ahorro (Gerencia)",
      value: `${effectiveCost.toFixed(2).replace(".", ",")} €`,
      suffix: "por expediente",
      change: "−66,2% coste",
      note: "ahorro est. 142.400 €/año",
      icon: "banknote" as IconName,
      color: "amber",
      up: false,
      highlight: roleInfo.id === "gerencia",
    },
    {
      title: "Mejoras IA implementadas",
      value: `${implementedCount}`,
      suffix: "de 19 propuestas",
      change: `${adoptionPct}%`,
      note: "tasa de adopción",
      icon: "brain" as IconName,
      color: "purple",
      up: true,
      highlight: roleInfo.id === "tecnico" || roleInfo.id === "gestor",
    },
  ];

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (seciFilter !== "all" && t.seciPhase !== seciFilter) return false;
    if (communityFilter === "all") return true;
    if (communityFilter === "soporte") return t.authorRole === "Soporte Técnico";
    if (communityFilter === "gestor") return t.authorRole === "Gestor de Trámites";
    if (communityFilter === "validado")
      return t.status === "Validado e incorporado a la guía del trámite";
    return true;
  });

  const filteredErrors = criticalFieldsData.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterStep === "all") return true;
    return item.stepNum === filterStep;
  });

  return (
    <div className="page-content">
      {/* Contextual Role Perspective Banner */}
      <RolePerspectiveBanner
        roleInfo={roleInfo}
        onNavigate={onNavigate}
        onOpenAcademic={onOpenAcademic}
      />

      {/* Active Procedure Selector Banner */}
      <div className="procedure-banner">
        <div className="procedure-banner-info">
          <div className="procedure-banner-tag">
            <Icon name="layers" size={16} />
            <span>TRÁMITE ACTIVO EN ANÁLISIS</span>
          </div>
          <div className="procedure-banner-selector">
            <select
              className="procedure-select-input"
              value={activeProcedure}
              onChange={(e) => {
                setActiveProcedure(e.target.value);
                setSelectedStep(3);
                setFilterStep("all");
                triggerToast(
                  `Cambiando vista al trámite: ${
                    proceduresList.find((p) => p.id === e.target.value)?.name
                  }`,
                );
              }}
              aria-label="Seleccionar procedimiento activo"
            >
              {proceduresList.map((proc) => (
                <option key={proc.id} value={proc.id}>
                  {proc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="procedure-meta-badges">
          <div className="procedure-meta-pill">
            <span>Código SIA:</span>
            <strong>{currentProc.siaCode}</strong>
          </div>
          <div className="procedure-meta-pill">
            <span>Expedientes:</span>
            <strong>{currentProc.activeFiles}</strong>
          </div>
          <div className="procedure-meta-pill">
            <span className="dot blue" />
            <strong>{currentProc.status}</strong>
          </div>
          <div className="procedure-meta-pill">
            <Icon name="clock" size={13} />
            <span>{currentProc.deadline}</span>
          </div>
        </div>
      </div>

      {/* 4 Superior KPIs (Organizativos + Proceso) */}
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <Panel key={kpi.title} className={`kpi-card ${kpi.highlight ? "kpi-role-focus" : ""}`}>
            <div className={`kpi-icon ${kpi.color}`}>
              <Icon name={kpi.icon} size={20} />
            </div>
            <p>{kpi.title}</p>
            <div className="kpi-value">
              {kpi.value} {kpi.suffix && <small>{kpi.suffix}</small>}
            </div>
            <div className="kpi-change">
              <span className="positive">
                <Icon name={kpi.up ? "arrowUp" : "arrowDown"} size={13} />
                {kpi.change}
              </span>{" "}
              {kpi.note}
            </div>
          </Panel>
        ))}
      </div>

      {/* Environment & External Benchmark Strip (ONTSI / AJE Canarias / Agenda España Digital) */}
      <div className="env-strip-grid">
        {environmentBenchmarks.map((b) => (
          <div key={b.source} className="env-strip-card">
            <div className="env-strip-top">
              <span className={`env-source-pill ${b.tone}`}>{b.source}</span>
              <strong className="env-metric">{b.metric}</strong>
            </div>
            <div className="env-label">{b.label}</div>
            <p className="env-note">{b.gapNote}</p>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="main-analysis-grid">
        {/* Funnel + Error Table */}
        <div className="funnel-section">
          <div className="funnel-section-header">
            <div>
              <h3>Embudo de tramitación por etapas y cuellos de botella</h3>
              <p>
                Recorrido de solicitantes en <strong>{currentProc.name}</strong> ({currentProc.abandoned}{" "}
                abandonos totales). Haz clic en una etapa para filtrar.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={`btn ${filterStep === "all" ? "primary" : "secondary"}`}
                style={{ minHeight: "32px", fontSize: "11px" }}
                onClick={() => setFilterStep("all")}
              >
                Todas las etapas
              </button>
            </div>
          </div>

          <div className="funnel-steps-container">
            {currentProc.funnel.map((step) => {
              const isSelected = selectedStep === step.number;
              return (
                <div
                  key={step.number}
                  className={`funnel-step-card ${isSelected ? "active" : ""} ${
                    step.badge?.type === "alert" ? "is-alert" : ""
                  } ${step.badge?.type === "critical" ? "is-critical" : ""}`}
                  onClick={() => {
                    setSelectedStep(step.number);
                    setFilterStep(step.number);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedStep(step.number);
                      setFilterStep(step.number);
                    }
                  }}
                  aria-label={`${step.name}: ${step.time}, ${step.badge?.text}`}
                >
                  <div className="step-card-top">
                    <span className="step-card-number">ETAPA {step.number}</span>
                    {step.badge && (
                      <span
                        className={`step-badge ${
                          step.badge.type === "critical"
                            ? "step-badge-critical"
                            : step.badge.type === "alert"
                              ? "step-badge-alert"
                              : "step-badge-green"
                        }`}
                      >
                        {step.badge.text}
                      </span>
                    )}
                  </div>
                  <div className="step-card-title">{step.name}</div>
                  <div
                    className={`step-card-time ${
                      step.badge?.type === "critical"
                        ? "time-critical"
                        : step.badge?.type === "alert"
                          ? "time-alert"
                          : ""
                    }`}
                  >
                    <Icon name="clock" size={14} />
                    <span>
                      Tiempo medio: <strong>{step.time}</strong>
                    </span>
                  </div>
                  <div className="step-card-bar-wrap">
                    <div className="step-card-bar-labels">
                      <span>
                        Conversión: <strong>{step.conversion}%</strong>
                      </span>
                      <span>
                        {step.abandonmentRate > 0 ? (
                          <strong
                            className={
                              step.abandonmentRate >= 30 ? "text-red-600" : "text-amber-600"
                            }
                          >
                            −{step.abandonmentRate}% abandono
                          </strong>
                        ) : (
                          "Completado"
                        )}
                      </span>
                    </div>
                    <div className="step-card-progress">
                      <div
                        className={`step-card-progress-fill ${
                          step.badge?.type === "critical"
                            ? "progress-fill-red"
                            : step.badge?.type === "alert"
                              ? "progress-fill-amber"
                              : step.number === 4
                                ? "progress-fill-green"
                                : "progress-fill-blue"
                        }`}
                        style={{ width: `${step.conversion}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedStep && currentProc.funnel[selectedStep - 1] && (
            <div className="funnel-diagnosis-box">
              <div className="diagnosis-stat">
                <Icon
                  name={selectedStep === 3 || selectedStep === 2 ? "alert" : "info"}
                  size={18}
                  className={
                    selectedStep === 3
                      ? "text-red-600"
                      : selectedStep === 2
                        ? "text-amber-600"
                        : "text-blue-600"
                  }
                />
                <span>
                  <strong>Diagnóstico de {currentProc.funnel[selectedStep - 1].name}:</strong>{" "}
                  {currentProc.funnel[selectedStep - 1].diagnostic}
                </span>
              </div>
              <button
                className="text-link"
                onClick={() => setFilterStep("all")}
                style={{ whiteSpace: "nowrap" }}
              >
                Ver todos los campos <Icon name="chevron" size={14} />
              </button>
            </div>
          )}

          <div className="errors-table-section">
            <div className="errors-table-header">
              <h4>
                <Icon name="form" size={18} className="text-blue-800" />
                <span>Campos con mayor tasa de error y documentación omitida</span>
              </h4>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Mostrando {filteredErrors.length} de {criticalFieldsData.length} campos analizados
              </span>
            </div>

            <div className="table-container">
              <table className="error-table">
                <thead>
                  <tr>
                    <th>CAMPO / DOCUMENTO</th>
                    <th>ETAPA</th>
                    <th>ERROR VALIDACIÓN</th>
                    <th>DOCUMENTACIÓN OMITIDA</th>
                    <th>ESTADO</th>
                    <th>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredErrors.map((row) => (
                    <tr key={row.name}>
                      <td>
                        <div className="field-name-cell">
                          <div
                            className={`field-type-icon ${row.type === "document" ? "doc" : ""}`}
                          >
                            <Icon
                              name={row.type === "document" ? "paperclip" : "fileText"}
                              size={16}
                            />
                          </div>
                          <div>
                            <strong>{row.name}</strong>
                            <span>
                              {row.type === "document"
                                ? "Archivo adjunto requerido"
                                : "Campo de datos de formulario"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: "#475569" }}>{row.step}</span>
                      </td>
                      <td>
                        <div className="rate-cell">
                          <div className="rate-cell-top">
                            <strong
                              className={
                                row.validationError >= 30 ? "text-red-700" : "text-amber-700"
                              }
                            >
                              {row.validationError}%
                            </strong>
                            <span style={{ fontSize: "10px", color: "#64748b" }}>de intentos</span>
                          </div>
                          <div className="rate-cell-bar">
                            <div
                              className={`rate-cell-fill ${
                                row.validationError >= 30 ? "fill-critical" : "fill-warning"
                              }`}
                              style={{ width: `${row.validationError}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="rate-cell">
                          <div className="rate-cell-top">
                            <strong
                              className={row.omittedDoc >= 30 ? "text-red-700" : "text-amber-700"}
                            >
                              {row.omittedDoc}%
                            </strong>
                            <span style={{ fontSize: "10px", color: "#64748b" }}>sin adjuntar</span>
                          </div>
                          <div className="rate-cell-bar">
                            <div
                              className={`rate-cell-fill ${
                                row.omittedDoc >= 30 ? "fill-critical" : "fill-warning"
                              }`}
                              style={{ width: `${row.omittedDoc}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`table-status-badge ${
                            row.status === "Crítico"
                              ? "table-status-critical"
                              : "table-status-review"
                          }`}
                        >
                          <Icon name="alert" size={12} />
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn secondary"
                          style={{ minHeight: "30px", padding: "0 10px", fontSize: "11px" }}
                          onClick={() => setSelectedErrorField(row)}
                        >
                          Ver diagnóstico
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel: AI Recommendations Engine */}
        <div className="ai-engine-panel">
          <div className="ai-engine-header">
            <div className="ai-engine-title-group">
              <h3>
                <Icon name="sparkles" size={18} className="text-violet-700" />
                <span>Motor de Recomendaciones IA</span>
              </h3>
              <p>Optimizaciones generadas a partir de patrones de error detectados.</p>
            </div>
            <div className="ai-pulse-chip">
              <span className="ai-pulse-dot" />
              <span>Tramita-AI activo</span>
            </div>
          </div>

          <div className="ai-cards-list">
            {/* Suggestion #1 */}
            <div className={`ai-card ${appliedSug1 ? "is-applied" : ""}`}>
              <div className="ai-card-badge-row">
                <span className="ai-impact-badge ai-impact-high">
                  <Icon name="sparkles" size={13} /> Impacto Alto
                </span>
                <span className="ai-card-step-tag">Paso 3 · Adjuntar Documentación</span>
              </div>
              <p className="ai-card-text">
                <strong>Simplificar instrucción en Paso 3:</strong> El <strong>46%</strong> omite la
                Escritura de Constitución. Eximir a autónomos, añadir tooltip y pre-validador PDF.
              </p>
              <div className="ai-card-metrics-preview">
                <div className="ai-card-metric-item">
                  <span>Conversión estimada</span>
                  <strong className="text-emerald-700">+14,2% solicitudes</strong>
                </div>
                <div className="ai-card-metric-item">
                  <span>Carga de soporte</span>
                  <strong className="text-emerald-700">−35% consultas</strong>
                </div>
              </div>
              <div className="ai-card-actions">
                {appliedSug1 ? (
                  <span className="applied-badge">
                    <Icon name="checkCircle" size={16} /> Aplicada en Staging y Simulador
                  </span>
                ) : (
                  <button className="btn-ai-primary" onClick={onApplySug1}>
                    <Icon name="check" size={15} /> Aplicar mejora
                  </button>
                )}
                <button className="btn-ai-secondary" onClick={onOpenDebate}>
                  <Icon name="users" size={15} /> Debatir en comunidad
                </button>
              </div>
            </div>

            {/* Suggestion #2 */}
            {!dismissedSug2 ? (
              <div className={`ai-card ${appliedSug2 ? "is-applied" : ""}`}>
                <div className="ai-card-badge-row">
                  <span className="ai-impact-badge ai-impact-medium">
                    <Icon name="sparkles" size={13} /> Impacto Medio
                  </span>
                  <span className="ai-card-step-tag">Paso 2 · Datos Fiscales</span>
                </div>
                <p className="ai-card-text">
                  <strong>Autocompletar formato IBAN en Paso 2:</strong> Evita el{" "}
                  <strong>42%</strong> de errores de validación sintáctica formateando espacios y
                  pre-verificando el dígito de control.
                </p>
                <div className="ai-card-metrics-preview">
                  <div className="ai-card-metric-item">
                    <span>Tiempo medio paso</span>
                    <strong className="text-blue-700">−2m 10s</strong>
                  </div>
                  <div className="ai-card-metric-item">
                    <span>Tasa de error IBAN</span>
                    <strong className="text-blue-700">De 42% a &lt;5%</strong>
                  </div>
                </div>
                <div className="ai-card-actions">
                  {appliedSug2 ? (
                    <span className="applied-badge">
                      <Icon name="checkCircle" size={16} /> Autocompletado activo
                    </span>
                  ) : (
                    <button className="btn-ai-primary" onClick={onApplySug2}>
                      <Icon name="check" size={15} /> Aplicar mejora
                    </button>
                  )}
                  <button
                    className="btn-ai-secondary"
                    onClick={() => {
                      setDismissedSug2(true);
                      triggerToast("Sugerencia #2 descartada temporalmente del panel activo.");
                    }}
                  >
                    <Icon name="x" size={15} /> Descartar
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "12px",
                  background: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Sugerencia #2 descartada</span>
                <button
                  className="text-link"
                  onClick={() => {
                    setDismissedSug2(false);
                    triggerToast("Sugerencia #2 restaurada.");
                  }}
                >
                  Deshacer
                </button>
              </div>
            )}

            {/* Direct CTA to Before vs After Simulator */}
            <button
              type="button"
              className="btn-ai-simulator-cta"
              onClick={() => onNavigate(2)}
            >
              <Icon name="compare" size={16} />
              <span>Ver impacto Antes vs. Después en Formulario Ciudadano</span>
              <Icon name="chevron" size={14} />
            </button>

            <div
              style={{
                padding: "14px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#166534",
                marginTop: "auto",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}
              >
                <Icon name="checkCircle" size={16} />
                <strong>Cumplimiento de objetivos IA</strong>
              </div>
              <p style={{ margin: 0, fontSize: "11px", lineHeight: 1.5, color: "#14532d" }}>
                {implementedCount} de 19 propuestas implementadas este trimestre. Tasa de adopción:{" "}
                <strong>{adoptionPct}%</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Community & SECI Section */}
      <div className="community-section">
        <div className="community-header">
          <div className="community-title-group">
            <h3>
              <Icon name="users" size={20} className="text-blue-800" />
              <span>Comunidad de Práctica y Conversión del Conocimiento (SECI)</span>
            </h3>
            <p>
              Espacio colaborativo entre Soporte Técnico y Gestores para transformar el conocimiento
              tácito ciudadano en reglas explícitas de mejora.
            </p>
          </div>
          <button className="btn-share-incident" onClick={onOpenNewIncident}>
            <Icon name="plus" size={17} /> Compartir nueva incidencia o buena práctica
          </button>
        </div>

        {/* SECI Interactive Model Strip */}
        <SeciModelCard selectedPhase={seciFilter} onSelectPhase={setSeciFilter} />

        {/* Filter Pills */}
        <div className="community-filter-row">
          <button
            className={`filter-pill ${communityFilter === "all" ? "active" : ""}`}
            onClick={() => setCommunityFilter("all")}
          >
            Todos los hilos ({threads.length})
          </button>
          <button
            className={`filter-pill ${communityFilter === "soporte" ? "active" : ""}`}
            onClick={() => setCommunityFilter("soporte")}
          >
            Soporte Técnico
          </button>
          <button
            className={`filter-pill ${communityFilter === "gestor" ? "active" : ""}`}
            onClick={() => setCommunityFilter("gestor")}
          >
            Gestores de Trámites
          </button>
          <button
            className={`filter-pill ${communityFilter === "validado" ? "active" : ""}`}
            onClick={() => setCommunityFilter("validado")}
          >
            Validados para guía oficial
          </button>
        </div>

        {/* Threads List */}
        <div className="threads-grid">
          {filteredThreads.map((thread) => {
            const isExpanded = expandedThreadId === thread.id;
            return (
              <article
                key={thread.id}
                className={`thread-card ${thread.id === "thread-1" ? "is-featured" : ""}`}
              >
                <div className="thread-top">
                  <div className="thread-title-area">
                    <h4>{thread.title}</h4>
                    <span className="seci-pill-badge">SECI: {thread.seciPhase}</span>
                    <span
                      className={`thread-status-tag ${
                        thread.status === "Validado e incorporado a la guía del trámite"
                          ? "tag-validated"
                          : thread.status === "En debate con IA"
                            ? "tag-discussion"
                            : "tag-review"
                      }`}
                    >
                      <Icon
                        name={
                          thread.status === "Validado e incorporado a la guía del trámite"
                            ? "checkCircle"
                            : "sparkles"
                        }
                        size={12}
                      />
                      {thread.status}
                    </span>
                  </div>
                  <button
                    className="text-link"
                    onClick={() =>
                      setExpandedThreadId((cur) => (cur === thread.id ? null : thread.id))
                    }
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "Ocultar respuestas" : "Ver debate"}
                    <Icon
                      name="chevron"
                      size={14}
                      className={isExpanded ? "rotate-90 transition-transform" : ""}
                    />
                  </button>
                </div>

                <div className="thread-meta-row">
                  <div className="author-badge">
                    <div className="author-avatar">{thread.authorName.charAt(0)}</div>
                    <span>
                      Iniciado por <strong>{thread.authorName}</strong>
                    </span>
                    <span
                      className={
                        thread.authorRole === "Soporte Técnico"
                          ? "role-tag-soporte"
                          : "role-tag-gestor"
                      }
                    >
                      {thread.authorRole}
                    </span>
                  </div>
                  <span>•</span>
                  <span>{thread.timeAgo}</span>
                  <span>•</span>
                  <span>{thread.repliesCount} respuestas registradas</span>
                </div>

                <p className="thread-content">{thread.description}</p>

                {thread.knowledgeSnippet && (
                  <div className="thread-knowledge-box">
                    <strong>Conocimiento explícito transferido:</strong>
                    {thread.knowledgeSnippet}
                  </div>
                )}

                <div className="thread-footer">
                  <div className="thread-tags">
                    {thread.tags.map((tag) => (
                      <span key={tag} className="thread-tag-pill">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="thread-stats">
                    {thread.status !== "Validado e incorporado a la guía del trámite" && (
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => onAdvanceThreadSeci(thread.id)}
                      >
                        <Icon name="checkCircle" size={14} /> Incorporar a guía oficial
                      </button>
                    )}
                    <span>
                      <Icon name="message" size={14} /> {thread.repliesCount} comentarios
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="thread-expanded-stream">
                    {thread.replies.map((reply, i) => (
                      <div key={i} className="reply-item">
                        <div
                          className="author-avatar"
                          style={{ width: "26px", height: "26px", fontSize: "10px" }}
                        >
                          {reply.author.charAt(0)}
                        </div>
                        <div className="reply-body">
                          <div className="reply-header">
                            <strong>
                              {reply.author}{" "}
                              <small style={{ color: "#64748b" }}>({reply.role})</small>
                            </strong>
                            <span>{reply.time}</span>
                          </div>
                          <p className="reply-text">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn secondary"
                      style={{ alignSelf: "flex-start", marginTop: "6px" }}
                      onClick={onOpenDebate}
                    >
                      <Icon name="plus" size={14} /> Añadir respuesta en mesa de debate
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      <ErrorDetailModal
        field={selectedErrorField}
        onClose={() => setSelectedErrorField(null)}
        onOpenSimulator={() => onNavigate(2)}
      />
    </div>
  );
}

function AnalyticsView({ triggerToast }: { triggerToast: (msg: string) => void }) {
  const [selectedId, setSelectedId] = useState(proceduresList[0].id);
  const currentProc = proceduresList.find((p) => p.id === selectedId) || proceduresList[0];

  const handleDownloadCsv = () => {
    const csvRows = [
      "Procedimiento,Iniciados,Conversion(%),Tiempo Medio,Tendencia(%),Estado",
      ...procedureBreakdownTable.map(
        (r) => `"${r.name}","${r.volume}",${r.success},"${r.time}",${r.trend},"${r.status}"`,
      ),
    ].join("\n");
    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tramitagc_analitica_procedimientos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast("Informe CSV de analítica de procedimientos exportado correctamente.");
  };

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <h2>Analítica de trámites y embudos</h2>
          <p>Identifica fricciones, abandonos y patrones de conversión por procedimiento.</p>
        </div>
        <div className="intro-actions">
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              triggerToast(
                `Mostrando embudo para: ${
                  proceduresList.find((p) => p.id === e.target.value)?.name
                }`,
              );
            }}
            aria-label="Filtrar por procedimiento"
          >
            {proceduresList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            className="btn secondary"
            onClick={() => triggerToast("Filtros temporales: Últimos 30 días (Convocatoria activa).")}
          >
            <Icon name="filter" size={17} />
            Convocatoria 2025
          </button>
        </div>
      </div>

      <div className="mini-kpis">
        {[
          [currentProc.initiated, "Trámites iniciados", "+6,8%"],
          [currentProc.submitted, "Presentados", "+12,3%"],
          [currentProc.abandoned, "Abandonos", "−18,5%"],
          [currentProc.avgTime, "Tiempo medio total", "−2m 10s"],
        ].map((x) => (
          <Panel key={x[1]}>
            <span>{x[1]}</span>
            <strong>{x[0]}</strong>
            <small>{x[2]} este mes</small>
          </Panel>
        ))}
      </div>

      <Panel className="analytics-funnel">
        <div className="panel-head">
          <div>
            <h3>Embudo de conversión por etapas: {currentProc.name}</h3>
            <p>
              Código SIA {currentProc.siaCode} · {currentProc.status} · Detección de cuellos de
              botella
            </p>
          </div>
          <Badge tone="blue">Actualizado hoy, 09:42</Badge>
        </div>
        <div className="big-funnel">
          {currentProc.funnel.map((step, i) => {
            const widths = [100, 82, 58, 44];
            return (
              <div
                key={step.number}
                style={{ width: `${widths[i] || 50}%` }}
                className={`funnel-step step-${i}`}
              >
                <span>
                  {step.name} ({step.time}
                  {step.badge ? ` · ${step.badge.text}` : ""})
                </span>
                <strong>{step.completed} completaron</strong>
                <small>{step.conversion}% conversión</small>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel className="procedures-panel">
        <div className="panel-head">
          <div>
            <h3>Desglose comparativo por procedimiento</h3>
            <p>Indicadores de proceso agregados de la administración</p>
          </div>
          <button className="text-link" onClick={handleDownloadCsv}>
            Descargar CSV <Icon name="download" size={14} />
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>PROCEDIMIENTO</th>
                <th>INICIADOS</th>
                <th>CONVERSIÓN</th>
                <th>TIEMPO MEDIO</th>
                <th>TENDENCIA</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {procedureBreakdownTable.map((r) => (
                <tr key={r.name}>
                  <td>
                    <strong>{r.name}</strong>
                  </td>
                  <td>{r.volume}</td>
                  <td>{r.success}%</td>
                  <td>{r.time}</td>
                  <td className={r.trend > 0 ? "trend-up" : "trend-down"}>
                    {r.trend > 0 ? "+" : ""}
                    {r.trend}%
                  </td>
                  <td>
                    <Badge
                      tone={
                        r.status === "Crítico" ? "red" : r.status === "Atención" ? "amber" : "green"
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function RecommendationsView({
  appliedMap,
  onToggleSim,
  onNavigate,
  triggerToast,
}: {
  appliedMap: Record<"sug1" | "sug2" | "cnae" | "cert", boolean>;
  onToggleSim: (key: "sug1" | "sug2" | "cnae" | "cert") => void;
  onNavigate: (tab: number) => void;
  triggerToast: (msg: string) => void;
}) {
  const [extraImplemented, setExtraImplemented] = useState<string[]>([]);

  const isImplemented = (id: string, simKey?: "sug1" | "sug2" | "cnae" | "cert") => {
    if (simKey) return appliedMap[simKey];
    return extraImplemented.includes(id);
  };

  const toggleItem = (id: string, simKey?: "sug1" | "sug2" | "cnae" | "cert", title?: string) => {
    if (simKey) {
      onToggleSim(simKey);
    } else {
      setExtraImplemented((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
      triggerToast(`Estado actualizado para: ${title}`);
    }
  };

  const activeSimCount = Object.values(appliedMap).filter(Boolean).length + extraImplemented.length;
  const totalQuarter = 14 + activeSimCount;

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <h2>Recomendaciones IA</h2>
          <p>
            Propuestas accionables basadas en comportamiento, incidencias tácitas y conocimiento
            institucional.
          </p>
        </div>
        <div className="intro-actions">
          <button className="btn secondary" onClick={() => onNavigate(2)}>
            <Icon name="compare" size={16} /> Ver impacto en Simulador
          </button>
          <button
            className="btn primary"
            onClick={() =>
              triggerToast(
                "Análisis Tramita-AI completado: 5 patrones prioritarios sincronizados con la telemetría actual.",
              )
            }
          >
            <Icon name="sparkles" size={17} />
            Generar nuevo análisis
          </button>
        </div>
      </div>

      <div className="recommend-layout">
        <div className="recommend-list">
          {recommendationsCatalog.map((rec, i) => {
            const done = isImplemented(rec.id, rec.simulatesImprovement);
            return (
              <Panel className={`recommend-card ${done ? "done" : ""}`} key={rec.id}>
                <div className="recommend-number">
                  {done ? <Icon name="check" /> : String(i + 1).padStart(2, "0")}
                </div>
                <div className="recommend-body">
                  <div>
                    <Badge
                      tone={
                        rec.impact === "Alto impacto"
                          ? "green"
                          : rec.impact === "Impacto medio"
                            ? "amber"
                            : "gray"
                      }
                    >
                      {rec.impact}
                    </Badge>
                    <span className="confidence">Confianza {rec.confidence}%</span>
                    <span className="seci-pill-badge" style={{ marginLeft: "6px" }}>
                      {rec.seciLink}
                    </span>
                  </div>
                  <h3>{rec.title}</h3>
                  <p>{rec.description}</p>
                  <footer>
                    <span>
                      <Icon name="form" size={15} />
                      {rec.procedureStep}
                    </span>
                    <strong>{rec.expectedResult}</strong>
                  </footer>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <button
                    className={`btn ${done ? "primary" : "secondary"}`}
                    onClick={() => toggleItem(rec.id, rec.simulatesImprovement, rec.title)}
                  >
                    {done ? "Implementada" : "Aplicar mejora"}
                  </button>
                  {rec.simulatesImprovement && (
                    <button
                      className="text-link"
                      style={{ justifyContent: "center" }}
                      onClick={() => onNavigate(2)}
                    >
                      Probar Antes/Después
                    </button>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>

        <aside>
          <Panel className="implementation-summary">
            <h3>Progreso de implementación</h3>
            <div className="donut">
              <span>
                {Math.min(19, totalQuarter)}
                <small>de 19</small>
              </span>
            </div>
            <p>
              Has implementado el{" "}
              <strong>{Math.min(100, Math.round((totalQuarter / 19) * 100))}%</strong> de las
              propuestas de este trimestre.
            </p>
            <div className="summary-row">
              <span>Impacto estimado</span>
              <strong>+{14 + activeSimCount * 1.4}% conversión</strong>
            </div>
            <div className="summary-row">
              <span>Horas soporte ahorradas</span>
              <strong>{760 + activeSimCount * 45} h</strong>
            </div>
            <div className="summary-row">
              <span>Ahorro económico anual</span>
              <strong>{(115 + activeSimCount * 11.2).toFixed(1)}k €</strong>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function KnowledgeView({
  threads,
  onOpenNewIncident,
  onNavigate,
  searchQuery,
}: {
  threads: CommunityThread[];
  onOpenNewIncident: () => void;
  onNavigate: (tab: number) => void;
  searchQuery: string;
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [seciPhase, setSeciPhase] = useState<SeciPhase | "all">("all");

  const articles = [
    [
      "Guía oficial: Validación de Certificado Bancario y vigencia de 90 días (Paso 2)",
      "Instrucción de Procedimientos · Interiorización",
      "6 min",
      "342 lecturas",
    ],
    [
      "Protocolo de digitalización y pre-validación de Escrituras Notariales en PDF (Paso 3)",
      "Buenas prácticas GovTech · Combinación",
      "8 min",
      "289 lecturas",
    ],
    [
      "Cuadro de equivalencias CNAE para Pymes y Comercios Digitales (AJE Canarias)",
      "Soporte Técnico · Exteriorización",
      "5 min",
      "415 lecturas",
    ],
    [
      "Plantilla de verificación de requisitos previos para Subvenciones",
      "Recursos para Gestores",
      "4 min",
      "190 descargas",
    ],
  ];

  const query = (localSearch || searchQuery).trim().toLowerCase();
  const filteredArticles = articles.filter(
    (a) => !query || a[0].toLowerCase().includes(query) || a[1].toLowerCase().includes(query),
  );
  const filteredThreads = threads.filter(
    (t) =>
      (seciPhase === "all" || t.seciPhase === seciPhase) &&
      (!query ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)),
  );

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <h2>Comunidad de Práctica y Modelo SECI</h2>
          <p>
            Conversión continua de conocimiento tácito (Soporte) en conocimiento explícito (Guías e
            IA).
          </p>
        </div>
        <button className="btn primary" onClick={onOpenNewIncident}>
          + Nueva aportación tácita
        </button>
      </div>

      <Panel className="knowledge-hero">
        <div>
          <Badge tone="blue">BASE DE CONOCIMIENTO TRAMITAGC</Badge>
          <h3>Conocimiento colaborativo en acción</h3>
          <p>
            Explora guías validadas, acuerdos entre Soporte y Gestoría, y soluciones a incidencias
            recurrentes de pymes y ciudadanos.
          </p>
          <label className="knowledge-search">
            <Icon name="search" />
            <input
              placeholder="Buscar sobre Certificado Bancario, Escrituras, CNAE..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <button type="button" onClick={() => setLocalSearch("")}>
              {localSearch ? "Limpiar" : "Buscar"}
            </button>
          </label>
        </div>
        <Icon name="book" size={88} />
      </Panel>

      {/* SECI Spiral Visualization */}
      <div style={{ marginBottom: "18px" }}>
        <SeciModelCard selectedPhase={seciPhase} onSelectPhase={setSeciPhase} />
      </div>

      <div className="knowledge-grid">
        <div>
          <div className="section-title">
            <h3>Guías Explícitas y Documentos Validados ({filteredArticles.length})</h3>
            <button className="text-link" onClick={() => onNavigate(0)}>
              Ver hilos en Panel Principal <Icon name="chevron" size={14} />
            </button>
          </div>
          <div className="article-grid">
            {filteredArticles.map((a, i) => (
              <Panel className="article-card" key={a[0]}>
                <div className={`article-icon color-${i}`}>
                  <Icon name={i === 3 ? "download" : "book"} />
                </div>
                <Badge tone={i === 2 ? "green" : "blue"}>{a[1]}</Badge>
                <h3>{a[0]}</h3>
                <footer>
                  <span>{a[2]} de lectura</span>
                  <span>{a[3]}</span>
                </footer>
              </Panel>
            ))}
          </div>

          {/* Intangible Assets & Liabilities Panel */}
          <Panel style={{ padding: "18px", marginTop: "14px" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "13px", color: "#142036" }}>
              Activos de Capital Intelectual y Mitigación de Pasivos Intangibles
            </h3>
            <div className="pasivos-grid">
              {intellectualCapitalData.pasivos.map((p) => (
                <div key={p.title} className="pasivo-box">
                  <span className="badge badge-red">Pasivo: {p.title}</span>
                  <p>{p.detail}</p>
                  <div className="pasivo-mitigation">
                    <Icon name="checkCircle" size={13} /> {p.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel className="community-panel">
          <div className="panel-head">
            <div>
              <h3>Actividad SECI reciente</h3>
              <p>Hilos colaborativos ({filteredThreads.length})</p>
            </div>
            <Icon name="message" />
          </div>
          {filteredThreads.map((t) => (
            <div className="community-item" key={t.id}>
              <div className="avatar small">{t.authorName.slice(0, 2).toUpperCase()}</div>
              <div>
                <strong>
                  {t.authorName} ({t.authorRole})
                </strong>
                <p title={t.title}>{t.title}</p>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        t.status === "Validado e incorporado a la guía del trámite"
                          ? "#059669"
                          : "#6d28d9",
                    }}
                  >
                    {t.status === "Validado e incorporado a la guía del trámite"
                      ? "Validado"
                      : "En debate"}
                  </span>
                  <span>· {t.seciPhase}</span>
                </div>
              </div>
            </div>
          ))}
          <button className="btn secondary full" onClick={() => onNavigate(0)}>
            Gestionar debates en Panel Principal
          </button>
        </Panel>
      </div>
    </div>
  );
}

function AuditView({
  onOpenAcademic,
  triggerToast,
  searchQuery,
}: {
  onOpenAcademic: () => void;
  triggerToast: (msg: string) => void;
  searchQuery: string;
}) {
  const [auditSearch, setAuditSearch] = useState("");
  const audits = [
    [
      "AUD-2025-1842",
      "Modificación del formulario: Exención Escritura a Autónomos (Paso 3)",
      "María Sánchez (Gestora)",
      "Hoy, 09:42",
      "Cambio aprobado",
      "green",
    ],
    [
      "AUD-2025-1841",
      "Exportación de datos analíticos anonimizados (Benchmark ONTSI)",
      "Carlos Muñoz (Gerencia)",
      "Hoy, 08:17",
      "Registrado",
      "blue",
    ],
    [
      "AUD-2025-1839",
      "Actualización de política de conservación RGPD (90 días)",
      "Laura Romero (DPO)",
      "Ayer, 18:02",
      "Revisión requerida",
      "amber",
    ],
    [
      "AUD-2025-1835",
      "Despliegue validador sintáctico IBAN Módulo-97 en Staging",
      "Javier Morales (Personal Técnico)",
      "Ayer, 14:26",
      "Registrado",
      "blue",
    ],
    [
      "AUD-2025-1828",
      "Validación de guía ciudadana sobre Certificado Bancario",
      "Laura Martín (Soporte)",
      "28 may, 11:03",
      "Cambio aprobado",
      "green",
    ],
  ];

  const query = (auditSearch || searchQuery).trim().toLowerCase();
  const filteredAudits = audits.filter(
    (a) =>
      !query ||
      a[0].toLowerCase().includes(query) ||
      a[1].toLowerCase().includes(query) ||
      a[2].toLowerCase().includes(query),
  );

  const handleExportAudit = () => {
    const csv = [
      "ID,Actividad,Usuario,Fecha,Estado",
      ...filteredAudits.map((a) => `"${a[0]}","${a[1]}","${a[2]}","${a[3]}","${a[4]}"`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tramitagc_registro_auditoria.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast("Registro de auditoría ENS/RGPD exportado en formato CSV.");
  };

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <h2>Auditoría, Normativa e Indicadores de Entorno</h2>
          <p>
            Trazabilidad para DPO/Reguladores y alineación con Agenda España Digital, ONTSI y AJE
            Canarias.
          </p>
        </div>
        <button className="btn secondary" onClick={handleExportAudit}>
          <Icon name="download" size={17} />
          Exportar registro CSV
        </button>
      </div>

      <div className="compliance-grid">
        <Panel>
          <div className="compliance-score">
            <Icon name="shield" size={28} />
            <strong>96%</strong>
          </div>
          <div>
            <span>Índice de cumplimiento</span>
            <p>+2 puntos desde la última revisión</p>
          </div>
          <Badge tone="green">Óptimo</Badge>
        </Panel>
        <Panel>
          <strong>WCAG 2.2 AA</strong>
          <span>Accesibilidad ciudadana</span>
          <Badge tone="green">Conforme</Badge>
        </Panel>
        <Panel>
          <strong>ENS · Nivel Medio</strong>
          <span>Esquema Nacional Seguridad</span>
          <Badge tone="green">Conforme</Badge>
        </Panel>
        <Panel>
          <strong>RGPD</strong>
          <span>Anonimización y DPO</span>
          <Badge tone="amber">1 revisión</Badge>
        </Panel>
      </div>

      {/* Environment Indicators Panel */}
      <Panel style={{ padding: "18px", marginBottom: "14px" }}>
        <div className="panel-head" style={{ marginBottom: "12px" }}>
          <div>
            <h3>Indicadores de Entorno y Referencias Sectoriales</h3>
            <p>Seguimiento frente a observatorios oficiales y planes gubernamentales</p>
          </div>
          <Badge tone="blue">Alineación Estratégica</Badge>
        </div>
        <div className="env-strip-grid" style={{ marginBottom: 0 }}>
          {environmentBenchmarks.map((b) => (
            <div key={b.source} className="env-strip-card">
              <div className="env-strip-top">
                <span className={`env-source-pill ${b.tone}`}>{b.source}</span>
                <strong className="env-metric">{b.metric}</strong>
              </div>
              <div className="env-label">{b.label}</div>
              <p className="env-note">{b.gapNote}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="audit-panel">
        <div className="panel-head">
          <div>
            <h3>Registro de actividad y trazabilidad</h3>
            <p>Últimas acciones auditadas entre gestores, personal técnico y DPO</p>
          </div>
          <label className="small-search">
            <Icon name="search" size={16} />
            <input
              placeholder="Buscar en el registro"
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
            />
          </label>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID DE EVENTO</th>
                <th>ACTIVIDAD</th>
                <th>USUARIO / ROL</th>
                <th>FECHA Y HORA</th>
                <th>ESTADO</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map((a) => (
                <tr key={a[0]}>
                  <td className="event-id">{a[0]}</td>
                  <td>
                    <strong>{a[1]}</strong>
                  </td>
                  <td>{a[2]}</td>
                  <td>{a[3]}</td>
                  <td>
                    <Badge tone={a[5] as "green" | "blue" | "amber"}>{a[4]}</Badge>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => triggerToast(`Evento ${a[0]} verificado con firma de registro.`)}
                      aria-label={`Ver detalle ${a[0]}`}
                    >
                      <Icon name="external" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="normative">
        <div>
          <Icon name="shield" />
          <div>
            <h3>Gobernanza GCO, Matriz de Accionistas y Marco Normativo</h3>
            <p>
              Sincronizado con ENS, RGPD, Ley 39/2015 PACAP y Agenda España Digital · Proyecto ESIT -
              ULL.
            </p>
          </div>
        </div>
        <button className="btn secondary" onClick={onOpenAcademic}>
          Ver Matriz de Accionistas y Capital <Icon name="external" size={15} />
        </button>
      </Panel>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<StakeholderRoleId>("gestor");
  const [activeProcedure, setActiveProcedure] = useState<string>("pymes-digital");
  const [searchQuery, setSearchQuery] = useState("");

  // Shared AI & GC Improvements state (connects Dashboard, Recommendations, and Simulator!)
  const [appliedSug1, setAppliedSug1] = useState(false);
  const [appliedSug2, setAppliedSug2] = useState(false);
  const [appliedCnae, setAppliedCnae] = useState(false);
  const [appliedCert, setAppliedCert] = useState(true);

  // Shared Community Threads
  const [threads, setThreads] = useState<CommunityThread[]>(initialThreads);

  // Shared Modals & Toast
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [isDebateOpen, setIsDebateOpen] = useState(false);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const roleInfo = stakeholderRoles.find((r) => r.id === role) || stakeholderRoles[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4500);
  };

  const handleRoleChange = (newRole: StakeholderRoleId) => {
    setRole(newRole);
    const info = stakeholderRoles.find((r) => r.id === newRole);
    if (info) {
      triggerToast(`Vista adaptada al rol: ${info.label} (${info.quadrant})`);
      if (newRole === "ciudadano") setActive(2);
      else if (newRole === "dpo") setActive(5);
    }
  };

  const handleToggleImprovement = (key: "sug1" | "sug2" | "cnae" | "cert") => {
    if (key === "sug1") {
      setAppliedSug1((v) => {
        const next = !v;
        triggerToast(
          next
            ? "Mejora #1 activada: Exención a autónomos y pre-validador PDF activos en el Simulador."
            : "Mejora #1 desactivada en el Simulador.",
        );
        return next;
      });
    } else if (key === "sug2") {
      setAppliedSug2((v) => {
        const next = !v;
        triggerToast(
          next
            ? "Mejora #2 activada: Autocompletado y validación IBAN Módulo-97 activos."
            : "Mejora #2 desactivada.",
        );
        return next;
      });
    } else if (key === "cnae") {
      setAppliedCnae((v) => {
        const next = !v;
        triggerToast(
          next
            ? "Buscador asistido CNAE (Tabla AJE/Soporte) activado en el formulario."
            : "Buscador CNAE desactivado.",
        );
        return next;
      });
    } else {
      setAppliedCert((v) => {
        const next = !v;
        triggerToast(
          next
            ? "Aviso proactivo de vigencia Certificado Bancario (<90 días) activado."
            : "Aviso proactivo desactivado.",
        );
        return next;
      });
    }
  };

  const handleApplyAllImprovements = () => {
    setAppliedSug1(true);
    setAppliedSug2(true);
    setAppliedCnae(true);
    setAppliedCert(true);
    triggerToast(
      "¡Todas las mejoras de Gestión del Conocimiento activadas! Observa la comparativa Antes vs. Después.",
    );
  };

  const handleAddThread = (newThread: Partial<CommunityThread>) => {
    const completeThread: CommunityThread = {
      id: `thread-${Date.now()}`,
      title: newThread.title || "Nueva aportación",
      authorName: newThread.authorName || roleInfo.userName,
      authorRole: newThread.authorRole || "Soporte Técnico",
      seciPhase: newThread.seciPhase || "Exteriorización",
      repliesCount: 1,
      timeAgo: "Ahora mismo",
      status: newThread.status || "En debate con IA",
      description: newThread.description || "",
      knowledgeSnippet: newThread.knowledgeSnippet,
      tags: newThread.tags || ["General"],
      replies: newThread.replies || [],
    };
    setThreads((prev) => [completeThread, ...prev]);
    triggerToast(
      `Nueva incidencia compartida en fase SECI "${completeThread.seciPhase}".`,
    );
  };

  const handleAdvanceThreadSeci = (id: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              seciPhase: "Interiorización",
              status: "Validado e incorporado a la guía del trámite",
            }
          : t,
      ),
    );
    triggerToast(
      "Conocimiento validado: hilo promovido a fase 'Interiorización' e incorporado a la guía oficial.",
    );
  };

  const titles = [
    "Panel de Control",
    "Analítica de Trámites",
    "Simulador Antes vs. Después",
    "Recomendaciones IA",
    "Comunidad y Modelo SECI",
    "Auditoría, Entorno y Normativa",
  ];

  const views = [
    <Dashboard
      roleInfo={roleInfo}
      activeProcedure={activeProcedure}
      setActiveProcedure={setActiveProcedure}
      appliedSug1={appliedSug1}
      appliedSug2={appliedSug2}
      onApplySug1={() => {
        setAppliedSug1(true);
        triggerToast(
          "Mejora #1 aplicada en Staging y Simulador: Exención a autónomos y pre-validador PDF activados.",
        );
      }}
      onApplySug2={() => {
        setAppliedSug2(true);
        triggerToast(
          "Mejora #2 aplicada con éxito: Autocompletado y validación IBAN activos en Paso 2.",
        );
      }}
      threads={threads}
      onOpenNewIncident={() => setIsNewIncidentOpen(true)}
      onOpenDebate={() => setIsDebateOpen(true)}
      onAdvanceThreadSeci={handleAdvanceThreadSeci}
      onNavigate={setActive}
      onOpenAcademic={() => setIsAcademicModalOpen(true)}
      triggerToast={triggerToast}
      searchQuery={searchQuery}
    />,
    <AnalyticsView triggerToast={triggerToast} />,
    <ImpactSimulatorView
      appliedSug1={appliedSug1}
      appliedSug2={appliedSug2}
      appliedCnae={appliedCnae}
      appliedCert={appliedCert}
      onToggleImprovement={handleToggleImprovement}
      onApplyAll={handleApplyAllImprovements}
    />,
    <RecommendationsView
      appliedMap={{
        sug1: appliedSug1,
        sug2: appliedSug2,
        cnae: appliedCnae,
        cert: appliedCert,
      }}
      onToggleSim={handleToggleImprovement}
      onNavigate={setActive}
      triggerToast={triggerToast}
    />,
    <KnowledgeView
      threads={threads}
      onOpenNewIncident={() => setIsNewIncidentOpen(true)}
      onNavigate={setActive}
      searchQuery={searchQuery}
    />,
    <AuditView
      onOpenAcademic={() => setIsAcademicModalOpen(true)}
      triggerToast={triggerToast}
      searchQuery={searchQuery}
    />,
  ];

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        setActive={setActive}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        role={role}
        setRole={handleRoleChange}
        roleInfo={roleInfo}
        onOpenAcademic={() => setIsAcademicModalOpen(true)}
      />
      <main>
        <Header
          title={titles[active]}
          eyebrow="TramitaGC"
          onMenu={() => setSidebarOpen(true)}
          roleInfo={roleInfo}
          onOpenAcademic={() => setIsAcademicModalOpen(true)}
          onNavigate={setActive}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {views[active]}
        <footer className="app-footer">
          <span>
            <strong>TramitaGC</strong> · Sistema Inteligente de Analítica de Procesos y Gestión del
            Conocimiento
          </span>
          <span>
            GCO (ESIT - Universidad de La Laguna, 2026-2027) · Eduardo Cruz González &amp; Álvaro
            Martín Pérez-Dionis
          </span>
        </footer>
      </main>

      <NewIncidentModal
        key={role}
        isOpen={isNewIncidentOpen}
        onClose={() => setIsNewIncidentOpen(false)}
        onSubmit={handleAddThread}
        defaultRole={
          role === "soporte"
            ? "Soporte Técnico"
            : role === "tecnico"
              ? "Personal Técnico"
              : "Gestor de Trámites"
        }
      />
      <DebateModal
        isOpen={isDebateOpen}
        onClose={() => setIsDebateOpen(false)}
        currentUserLabel={`${roleInfo.userName} (${roleInfo.label})`}
        onConsensus={() => {
          setAppliedSug1(true);
          triggerToast(
            "Consenso alcanzado (SECI Combinación): Mejora #1 aprobada y activada en el Simulador.",
          );
        }}
      />
      <AcademicProjectModal
        isOpen={isAcademicModalOpen}
        onClose={() => setIsAcademicModalOpen(false)}
        activeRole={role}
        onSelectRole={handleRoleChange}
      />

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
