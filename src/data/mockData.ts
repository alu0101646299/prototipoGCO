export type ImprovementKey = "sug1" | "sug2" | "cnae" | "cert";
export type AppliedImprovements = Record<ImprovementKey, boolean>;
export type CommunityRole = "Soporte Técnico" | "Gestor de Trámites" | "Personal Técnico";

export interface ThreadComment {
  author: string;
  role: CommunityRole;
  text: string;
}

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
  role: CommunityRole;
  status: "En debate" | "Aprobado e implantado";
  description: string;
  linkedImprovement?: ImprovementKey;
  comments: ThreadComment[];
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
    name: "Identificación (Cl@ve)",
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

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    title: "Autónomos bloqueados al exigir Escritura de Constitución",
    author: "Carlos R.",
    role: "Gestor de Trámites",
    status: "En debate",
    description:
      "El 46% de abandonos en el Paso 3 ocurre porque los solicitantes autónomos no disponen de escritura societaria o suben capturas de móvil en lugar de PDF.",
    linkedImprovement: "sug1",
    comments: [
      {
        author: "Laura M.",
        role: "Soporte Técnico",
        text: "En soporte atendemos unas 30 llamadas diarias por esto. Los autónomos se quedan bloqueados porque el campo está marcado como obligatorio.",
      },
      {
        author: "Carlos R.",
        role: "Gestor de Trámites",
        text: "Propongo que si el usuario selecciona 'Autónomo' en el primer paso, la escritura quede exenta automáticamente y solo se exija a sociedades.",
      },
      {
        author: "Javier M.",
        role: "Personal Técnico",
        text: "Podemos aplicar la regla condicional en el formulario y añadir un pre-validador para rechazar imágenes sueltas que no sean PDF.",
      },
    ],
  },
  {
    id: "post-2",
    title: "48 llamadas semanales por Certificado Bancario emitido hace más de 90 días",
    author: "Laura M.",
    role: "Soporte Técnico",
    status: "En debate",
    description:
      "Los ciudadanos adjuntan certificados antiguos o recibos domiciliados sin sello oficial, lo que provoca la paralización del expediente.",
    linkedImprovement: "cert",
    comments: [
      {
        author: "Laura M.",
        role: "Soporte Técnico",
        text: "El 35% de los rechazos bancarios se deben a que el certificado tiene fecha de hace un año o no incluye el sello del banco.",
      },
      {
        author: "Carlos R.",
        role: "Gestor de Trámites",
        text: "Aprobemos una advertencia destacada en el campo advirtiendo de la vigencia máxima de 90 días y los requisitos de firma bancaria.",
      },
    ],
  },
  {
    id: "post-3",
    title: "Dudas con el código CNAE en empresas de comercio online y software",
    author: "Elena P.",
    role: "Soporte Técnico",
    status: "En debate",
    description:
      "El desplegable numérico genera confusiones entre comercio digital (4791) y consultoría/software (6201); el 27% introduce un código incorrecto.",
    linkedImprovement: "cnae",
    comments: [
      {
        author: "Elena P.",
        role: "Soporte Técnico",
        text: "Hemos preparado una tabla interna de correspondencias con las actividades más consultadas para ayudar a los solicitantes.",
      },
      {
        author: "Javier M.",
        role: "Personal Técnico",
        text: "Podemos incorporar esa tabla directamente en un buscador por palabras clave para que el usuario escriba 'tienda' o 'programación' y le asigne el código.",
      },
    ],
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
