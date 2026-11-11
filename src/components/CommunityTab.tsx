import { useState, type FormEvent } from "react";
import { SECI_PHASES, type CommunityPost, type SeciPhase } from "../data/mockData";

interface CommunityTabProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, "id">) => void;
  onPromotePost: (post: CommunityPost) => void;
}

export function CommunityTab({ posts, onAddPost, onPromotePost }: CommunityTabProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newRole, setNewRole] = useState<"Soporte Técnico" | "Gestor de Trámites">(
    "Soporte Técnico",
  );
  const [newPhase, setNewPhase] = useState<SeciPhase>("Exteriorización");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddPost({
      title: newTitle.trim(),
      author: newRole === "Soporte Técnico" ? "Soporte N1" : "Gestor de Trámite",
      role: newRole,
      seciPhase: newPhase,
      status: newPhase === "Interiorización" ? "Validado en guía oficial" : "En análisis",
      description: newDesc.trim() || "Incidencia registrada desde el prototipo para análisis.",
    });
    setNewTitle("");
    setNewDesc("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Comunidad de Práctica y Modelo SECI</h2>
        <p className="text-xs text-slate-500">
          Conversión continua del conocimiento tácito (soporte y usuarios) en mejoras explícitas
        </p>
      </div>

      {/* Ciclo SECI resumido */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SECI_PHASES.map((item) => (
          <div
            key={item.phase}
            className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-blue-800">{item.phase}</span>
              <span className="text-[10px] font-semibold text-slate-500">{item.flow}</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600">{item.summary}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800">
                    {post.seciPhase}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {post.author} ({post.role})
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    post.status === "Validado en guía oficial"
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  {post.status}
                </span>
              </div>
              <h3 className="mt-1.5 text-sm font-bold text-slate-900">{post.title}</h3>
              <p className="mt-1 text-xs text-slate-600">{post.description}</p>
              {post.seciPhase !== "Interiorización" && (
                <button
                  type="button"
                  onClick={() => onPromotePost(post)}
                  className="mt-2.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-800 hover:bg-blue-100"
                >
                  Validar y pasar a Interiorización
                </button>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 self-start rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
        >
          <h3 className="text-sm font-bold text-slate-900">Registrar nueva incidencia</h3>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="post-role">
              Rol que aporta
            </label>
            <select
              id="post-role"
              value={newRole}
              onChange={(e) =>
                setNewRole(e.target.value as "Soporte Técnico" | "Gestor de Trámites")
              }
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
            >
              <option value="Soporte Técnico">Soporte Técnico</option>
              <option value="Gestor de Trámites">Gestor de Trámites</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="post-phase">
              Fase SECI
            </label>
            <select
              id="post-phase"
              value={newPhase}
              onChange={(e) => setNewPhase(e.target.value as SeciPhase)}
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
            >
              {SECI_PHASES.map((s) => (
                <option key={s.phase} value={s.phase}>
                  {s.phase}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="post-title">
              Problema detectado
            </label>
            <input
              id="post-title"
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ej. Dudas al firmar con Cl@ve Móvil"
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="post-desc">
              Propuesta de mejora
            </label>
            <textarea
              id="post-desc"
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descripción breve para compartir con gestores..."
              className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Publicar en comunidad
          </button>
        </form>
      </div>
    </div>
  );
}
