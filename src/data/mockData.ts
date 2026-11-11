export type ImprovementKey = "sug1" | "sug2" | "cnae" | "cert";
export type AppliedImprovements = Record<ImprovementKey, boolean>;
export type SeciPhase = "Socialización" | "Exteriorización" | "Combinación" | "Interiorización";

export interface FunnelStep {
  number: number;
  name: string;
  avgTime: string;
  baseConversion: number;
  baseAbandonment: number;
  note: string;
}

export interface CriticalField {
  name: string;
  step: string;
  validationErrorPct: number;
  omittedDocPct: number;
  status: "Crítico" | "Revisar";
  improvementKeys: ImprovementKey[];
}

export interface Recommendation {
  key: ImprovementKey;
  title: string;
  step: string;
  impactLabel: string;
  description: string;
  seciOrigin: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  role: "Soporte Técnico" | "Gestor de Trámites";
  seciPhase: SeciPhase;
  status: "En análisis" | "Validado en guía oficial";
  description: string;
  linkedImprovement?: ImprovementKey;
}

export const PROCEDURE = {
  name: "Solicitud de Subvención Digitalización Pymes",
  siaCode: "2849102",
  activeFiles: 14820,
  deadline: "Convocatoria 2026 · Abierta hasta 30 nov 2026",
};

export const FUNNEL_STEPS: FunnelStep[] = [
  {
    number: 1,
    name: "Identificación (Cl@ve / Certificado)",
    avgTime: "1m 20s",
    baseConversion: 92,
    baseAbandonment: 8,
    note: "Flujo estable sin fricción destacable.",
  },
  {
    number: 2,
    name: "Datos Fiscales (IBAN y CNAE)",
    avgTime: "4m 50s",
    baseConversion: 78,
    baseAbandonment: 22,
    note: "Fricción alta en formato IBAN (42%) y código CNAE (27%).",
  },
  {
    number: 3,
    name: "Adjuntar Documentación",
    avgTime: "6m 15s",
    baseConversion: 62,
    baseAbandonment: 38,
    note: "Cuello de botella principal: 46% omite Escritura o sube fotos JPG.",
  },
  {
    number: 4,
    name: "Firma y Envío",
    avgTime: "1m 10s",
    baseConversion: 93,
    baseAbandonment: 7,
    note: "Alta conversión final entre quienes superan el Paso 3.",
  },
];

export const CRITICAL_FIELDS: CriticalField[] = [
  {
    name: "Escritura de Constitución",
    step: "Paso 3 · Documentación",
    validationErrorPct: 15,
    omittedDocPct: 46,
    status: "Crítico",
    improvementKeys: ["sug1"],
  },
  {
    name: "IBAN / Certificado Bancario",
    step: "Paso 2 · Datos Fiscales",
    validationErrorPct: 42,
    omittedDocPct: 29,
    status: "Crítico",
    improvementKeys: ["sug2", "cert"],
  },
  {
    name: "Código CNAE Actividad",
    step: "Paso 2 · Datos Fiscales",
    validationErrorPct: 27,
    omittedDocPct: 8,
    status: "Revisar",
    improvementKeys: ["cnae"],
  },
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    key: "sug1",
    title: "Eximir Escritura a autónomos y pre-validar PDF",
    step: "Paso 3",
    impactLabel: "+16,2 pts éxito · −22% abandono",
    description:
      "Oculta la Escritura societaria a personas físicas/autónomos y valida formato PDF antes de enviar.",
    seciOrigin: "Hilo Soporte + Gestor (Exteriorización)",
  },
  {
    key: "sug2",
    title: "Autocompletar y validar IBAN en tiempo real",
    step: "Paso 2",
    impactLabel: "+10,4 pts éxito · −85 tickets/sem",
    description:
      "Formatea espacios cada 4 caracteres y comprueba el dígito de control antes de cambiar de paso.",
    seciOrigin: "Telemetría Paso 2",
  },
  {
    key: "cnae",
    title: "Buscador asistido de CNAE por palabra clave",
    step: "Paso 2",
    impactLabel: "+7,8 pts éxito · −70 tickets/sem",
    description:
      "Sustituye códigos crípticos por búsqueda sencilla (ej. 'tienda online' → 4791) consensuada por Soporte.",
    seciOrigin: "Tabla equivalencias (Combinación)",
  },
  {
    key: "cert",
    title: "Aviso proactivo de Certificado Bancario (<90 días)",
    step: "Paso 2",
    impactLabel: "+7,0 pts éxito · −80 tickets/sem",
    description:
      "Muestra los requisitos de vigencia y sello bancario detectados tras 48 consultas semanales en soporte.",
    seciOrigin: "Incidencia Soporte N1 (Combinación)",
  },
];

export const SECI_PHASES: Array<{ phase: SeciPhase; flow: string; summary: string }> = [
  {
    phase: "Socialización",
    flow: "Tácito → Tácito",
    summary: "Soporte recoge dudas repetidas en llamadas y chat ciudadano.",
  },
  {
    phase: "Exteriorización",
    flow: "Tácito → Explícito",
    summary: "Las incidencias se documentan en hilos internos con propuesta clara.",
  },
  {
    phase: "Combinación",
    flow: "Explícito → Explícito",
    summary: "Se cruza telemetría del embudo con guías oficiales y validadores.",
  },
  {
    phase: "Interiorización",
    flow: "Explícito → Tácito",
    summary: "Las mejoras se despliegan en el formulario y el usuario finaliza sin ayuda.",
  },
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    title: "Autónomos bloqueados al exigir Escritura de Constitución",
    author: "Carlos R.",
    role: "Gestor de Trámites",
    seciPhase: "Exteriorización",
    status: "En análisis",
    description:
      "El 46% de abandonos en Paso 3 ocurre porque los autónomos no tienen escritura societaria o suben fotos JPG.",
    linkedImprovement: "sug1",
  },
  {
    id: "post-2",
    title: "48 llamadas semanales por Certificado Bancario >90 días",
    author: "Laura M.",
    role: "Soporte Técnico",
    seciPhase: "Combinación",
    status: "Validado en guía oficial",
    description:
      "Se redactó una instrucción clara: antigüedad máxima 90 días, IBAN visible y sello o firma electrónica bancaria.",
    linkedImprovement: "cert",
  },
  {
    id: "post-3",
    title: "Equivalencias CNAE para comercio online y software",
    author: "Elena P.",
    role: "Soporte Técnico",
    seciPhase: "Combinación",
    status: "Validado en guía oficial",
    description:
      "Pymes digitales dudaban entre 4791 y 6201; se integró la tabla de equivalencias de Soporte al formulario.",
    linkedImprovement: "cnae",
  },
];

export const CNAE_EXAMPLES = [
  { code: "4791", label: "Comercio electrónico / tienda online" },
  { code: "6201", label: "Programación y desarrollo de software" },
  { code: "6202", label: "Consultoría tecnológica y digitalización" },
  { code: "5610", label: "Hostelería y restauración" },
];

export function computeImpact(applied: AppliedImprovements) {
  const activeCount = Object.values(applied).filter(Boolean).length;
  const firstAttemptSuccess = Number(
    (
      41.2 +
      (applied.sug1 ? 16.2 : 0) +
      (applied.sug2 ? 10.4 : 0) +
      (applied.cnae ? 7.8 : 0) +
      (applied.cert ? 7.0 : 0)
    ).toFixed(1),
  );
  const step2Abandon = Math.max(8, 22 - (applied.sug2 ? 8 : 0) - (applied.cnae ? 6 : 0));
  const step3Abandon = Math.max(9, 38 - (applied.sug1 ? 22 : 0) - (applied.cert ? 7 : 0));
  const supportTicketsWeek = Math.max(
    115,
    480 -
      (applied.sug1 ? 130 : 0) -
      (applied.sug2 ? 85 : 0) -
      (applied.cnae ? 70 : 0) -
      (applied.cert ? 80 : 0),
  );
  const supportWaitMin = Number(
    Math.max(
      3,
      18 -
        (applied.sug1 ? 5.0 : 0) -
        (applied.sug2 ? 3.5 : 0) -
        (applied.cnae ? 3.0 : 0) -
        (applied.cert ? 3.5 : 0),
    ).toFixed(1),
  );
  const costPerFile = Number(
    Math.max(
      4.8,
      14.2 -
        (applied.sug1 ? 3.6 : 0) -
        (applied.sug2 ? 2.4 : 0) -
        (applied.cnae ? 1.8 : 0) -
        (applied.cert ? 1.6 : 0),
    ).toFixed(2),
  );
  const annualSavingsEur = Math.round((14.2 - costPerFile) * PROCEDURE.activeFiles);

  return {
    activeCount,
    firstAttemptSuccess,
    step2Abandon,
    step2Conversion: 100 - step2Abandon,
    step3Abandon,
    step3Conversion: 100 - step3Abandon,
    supportTicketsWeek,
    supportWaitMin,
    costPerFile,
    annualSavingsEur,
  };
}
