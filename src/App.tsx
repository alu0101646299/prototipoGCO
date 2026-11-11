import { useState } from "react";
import { AnalyticsTab } from "./components/AnalyticsTab";
import { BeforeAfterTab } from "./components/BeforeAfterTab";
import { CommunityTab } from "./components/CommunityTab";
import { RecommendationsTab } from "./components/RecommendationsTab";
import {
  INITIAL_POSTS,
  PROCEDURE,
  computeImpact,
  type AppliedImprovements,
  type CommunityPost,
  type ImprovementKey,
} from "./data/mockData";

type TabId = "analytics" | "recommendations" | "community" | "comparison";

const INITIAL_IMPROVEMENTS: AppliedImprovements = {
  sug1: false,
  sug2: false,
  cnae: false,
  cert: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applied, setApplied] = useState<AppliedImprovements>(INITIAL_IMPROVEMENTS);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  const impact = computeImpact(applied);
  const pendingCount = 4 - impact.activeCount;

  const toggleImprovement = (key: ImprovementKey) => {
    setApplied((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyAll = () => {
    setApplied({ sug1: true, sug2: true, cnae: true, cert: true });
  };

  const resetAll = () => {
    setApplied(INITIAL_IMPROVEMENTS);
  };

  const handleAddPost = (newPost: Omit<CommunityPost, "id">) => {
    setPosts((prev) => [{ ...newPost, id: `post-${Date.now()}` }, ...prev]);
  };

  const handlePromotePost = (post: CommunityPost) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, seciPhase: "Interiorización", status: "Validado en guía oficial" }
          : p,
      ),
    );
    if (post.linkedImprovement) {
      setApplied((prev) => ({ ...prev, [post.linkedImprovement!]: true }));
    }
  };

  const navItems: Array<{ id: TabId; num: string; label: string; badge?: string }> = [
    { id: "analytics", num: "01", label: "Panel y Embudo" },
    {
      id: "recommendations",
      num: "02",
      label: "Recomendaciones",
      badge: pendingCount > 0 ? String(pendingCount) : undefined,
    },
    { id: "community", num: "03", label: "Comunidad SECI" },
    { id: "comparison", num: "04", label: "Antes vs. Después", badge: "DEMO" },
  ];

  const selectTab = (id: TabId) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Backdrop móvil */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
        />
      )}

      {/* Menú lateral minimalista */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between bg-slate-900 p-4 text-slate-200 transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                  TramitaGC
                </span>
                <span className="text-[11px] text-slate-400">GCO · ULL</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Analítica y Gestión del Conocimiento
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 md:hidden"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          <nav aria-label="Secciones del prototipo" className="space-y-1.5">
            <p className="px-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Módulos
            </p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-bold ${
                        isActive ? "text-blue-200" : "text-slate-500"
                      }`}
                    >
                      {item.num}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badge === "DEMO"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Resumen del trámite activo */}
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-xs">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Trámite de ejemplo</p>
            <p className="mt-0.5 font-semibold text-white">{PROCEDURE.name}</p>
            <p className="text-[11px] text-slate-400">
              SIA {PROCEDURE.siaCode} · {PROCEDURE.activeFiles.toLocaleString("es-ES")} exp.
            </p>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-slate-400">Mejoras GC activas</span>
              <span className="font-semibold text-white">{impact.activeCount} / 4</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full bg-emerald-400 transition-all"
                style={{ width: `${(impact.activeCount / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 md:hidden"
            >
              ☰ Menú
            </button>
            <div>
              <p className="text-[11px] font-medium text-slate-500">
                {PROCEDURE.name} · {PROCEDURE.deadline}
              </p>
              <h1 className="text-base font-bold text-slate-900">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 sm:inline-block">
              Éxito actual: {impact.firstAttemptSuccess.toFixed(1).replace(".", ",")}%
            </span>
            {impact.activeCount < 4 ? (
              <button
                type="button"
                onClick={applyAll}
                className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
              >
                Aplicar 4 mejoras
              </button>
            ) : (
              <button
                type="button"
                onClick={resetAll}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Reiniciar (0/4)
              </button>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
          {activeTab === "analytics" && (
            <AnalyticsTab
              applied={applied}
              impact={impact}
              onGoToRecommendations={() => selectTab("recommendations")}
            />
          )}
          {activeTab === "recommendations" && (
            <RecommendationsTab
              applied={applied}
              activeCount={impact.activeCount}
              onToggleImprovement={toggleImprovement}
              onGoToComparison={() => selectTab("comparison")}
            />
          )}
          {activeTab === "community" && (
            <CommunityTab
              posts={posts}
              onAddPost={handleAddPost}
              onPromotePost={handlePromotePost}
            />
          )}
          {activeTab === "comparison" && (
            <BeforeAfterTab
              applied={applied}
              impact={impact}
              onGoToRecommendations={() => selectTab("recommendations")}
            />
          )}
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
          <strong>TramitaGC</strong> · Gestión del Conocimiento en las Organizaciones (ESIT - ULL,
          2026-2027) · Eduardo Cruz González y Álvaro Martín Pérez-Dionis
        </footer>
      </div>
    </div>
  );
}
