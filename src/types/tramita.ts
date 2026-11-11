export type IconName =
  | "grid"
  | "funnel"
  | "sparkles"
  | "users"
  | "shield"
  | "search"
  | "bell"
  | "chevron"
  | "arrowUp"
  | "arrowDown"
  | "check"
  | "form"
  | "headset"
  | "brain"
  | "clock"
  | "external"
  | "menu"
  | "x"
  | "download"
  | "book"
  | "message"
  | "alert"
  | "filter"
  | "fileText"
  | "paperclip"
  | "creditCard"
  | "building"
  | "plus"
  | "info"
  | "share"
  | "checkCircle"
  | "trash"
  | "lightbulb"
  | "layers"
  | "compare"
  | "award"
  | "trendingUp"
  | "banknote"
  | "refresh";

export type StakeholderRoleId =
  | "gestor"
  | "soporte"
  | "gerencia"
  | "tecnico"
  | "dpo"
  | "ciudadano";

export interface StakeholderRole {
  id: StakeholderRoleId;
  label: string;
  userName: string;
  userTitle: string;
  initials: string;
  quadrant: string;
  powerInterest: string;
  contributes: string;
  receives: string;
  focusSummary: string;
  color: string;
}

export type SeciPhase =
  | "Socialización"
  | "Exteriorización"
  | "Combinación"
  | "Interiorización";

export interface FunnelStep {
  number: number;
  name: string;
  time: string;
  badge?: {
    text: string;
    type: "optimal" | "alert" | "critical";
  };
  started: string;
  completed: string;
  conversion: number;
  abandonmentRate: number;
  icon: IconName;
  diagnostic: string;
}

export interface CriticalField {
  name: string;
  type: "field" | "document";
  step: string;
  stepNum: number;
  validationError: number;
  omittedDoc: number;
  status: "Crítico" | "Revisar";
  solutionLinked: string;
  detail: string;
}

export interface ProcedureOption {
  id: string;
  name: string;
  siaCode: string;
  activeFiles: string;
  deadline: string;
  status: string;
  initiated: string;
  submitted: string;
  abandoned: string;
  avgTime: string;
  firstAttemptSuccess: number;
  supportTicketsWeek: number;
  supportWaitMin: number;
  costPerFile: number;
  funnel: FunnelStep[];
}

export interface CommunityThread {
  id: string;
  title: string;
  authorName: string;
  authorRole: "Soporte Técnico" | "Gestor de Trámites" | "Asesoría Jurídica" | "Personal Técnico";
  seciPhase: SeciPhase;
  repliesCount: number;
  timeAgo: string;
  status:
    | "Validado e incorporado a la guía del trámite"
    | "En debate con IA"
    | "En revisión normativa";
  description: string;
  knowledgeSnippet?: string;
  tags: string[];
  replies: Array<{
    author: string;
    role: string;
    text: string;
    time: string;
  }>;
}

export interface RecommendationItem {
  id: string;
  title: string;
  impact: "Alto impacto" | "Impacto medio" | "Impacto bajo";
  confidence: number;
  description: string;
  procedureStep: string;
  expectedResult: string;
  seciLink: string;
  simulatesImprovement?: "sug1" | "sug2" | "cnae" | "cert";
}
