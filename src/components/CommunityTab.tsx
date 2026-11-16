import { useState, type FormEvent } from "react";
import type { CommunityPost, CommunityRole } from "../data/mockData";

interface CommunityTabProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, "id" | "comments">) => void;
  onPromotePost: (post: CommunityPost) => void;
  onAddComment: (
    postId: string,
    comment: { author: string; role: CommunityRole; text: string },
  ) => void;
}

const ROLE_COLORS: Record<CommunityRole, string> = {
  "Soporte Técnico": "bg-blue-100 text-blue-800",
  "Gestor de Trámites": "bg-emerald-100 text-emerald-800",
  "Personal Técnico": "bg-purple-100 text-purple-800",
};

export function CommunityTab({ posts, onAddPost, onPromotePost, onAddComment }: CommunityTabProps) {
  // Estado para nuevo hilo
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAuthor, setNewAuthor] = useState("Laura M.");
  const [newRole, setNewRole] = useState<CommunityRole>("Soporte Técnico");

  // Estado para responder en un hilo específico
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyRoleMap, setReplyRoleMap] = useState<Record<string, CommunityRole>>({});
  const [replyAuthorMap, setReplyAuthorMap] = useState<Record<string, string>>({});

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddPost({
      title: newTitle.trim(),
      author: newAuthor.trim() || (newRole === "Soporte Técnico" ? "Soporte N1" : "Gestor"),
      role: newRole,
      status: "En debate",
      description: newDesc.trim() || "Incidencia registrada para debate entre técnicos y gestores.",
    });
    setNewTitle("");
    setNewDesc("");
  };

  const handleSendReply = (postId: string, e: FormEvent) => {
    e.preventDefault();
    const text = replyTextMap[postId]?.trim();
    if (!text) return;

    const role = replyRoleMap[postId] || "Gestor de Trámites";
    const author =
      replyAuthorMap[postId]?.trim() ||
      (role === "Soporte Técnico"
        ? "Laura M."
        : role === "Personal Técnico"
          ? "Javier M."
          : "Carlos R.");

    onAddComment(postId, { author, role, text });
    setReplyTextMap((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Comunidad</h2>
        <p className="text-xs text-slate-500">
          Espacio de discusión entre técnicos y gestores para registrar incidencias, debatir
          soluciones y aprobar mejoras en el trámite
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna izquierda: Lista de hilos con debate */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">
              Hilos de discusión ({posts.length})
            </span>
            <span className="text-xs text-slate-500">
              {posts.filter((p) => p.status === "En debate").length} en debate ·{" "}
              {posts.filter((p) => p.status === "Aprobado e implantado").length} implantadas
            </span>
          </div>

          {posts.map((post) => {
            const isApproved = post.status === "Aprobado e implantado";
            const replyRole = replyRoleMap[post.id] || "Gestor de Trámites";
            const replyText = replyTextMap[post.id] || "";

            return (
              <div
                key={post.id}
                className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                {/* Cabecera del hilo */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${ROLE_COLORS[post.role]}`}
                    >
                      {post.role}
                    </span>
                    <span className="font-semibold text-slate-800">{post.author}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isApproved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isApproved ? "✓ Aprobado e implantado" : "● En debate"}
                  </span>
                </div>

                {/* Título y descripción de la incidencia */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{post.title}</h3>
                  <p className="mt-1.5 rounded-lg border border-slate-100 bg-slate-50/80 p-3 text-xs leading-relaxed text-slate-700">
                    {post.description}
                  </p>
                </div>

                {/* Sección de intervenciones / comentarios entre técnicos y gestores */}
                <div className="space-y-2.5 pt-1">
                  <p className="text-[11px] font-bold text-slate-600 uppercase">
                    Debate entre equipo ({post.comments.length})
                  </p>
                  <div className="space-y-2">
                    {post.comments.map((comment, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-800"
                      >
                        <div className="mb-1 flex items-center gap-2 text-[11px]">
                          <span
                            className={`rounded px-1.5 py-0.2 font-semibold ${ROLE_COLORS[comment.role]}`}
                          >
                            {comment.role}
                          </span>
                          <span className="font-semibold text-slate-700">{comment.author}</span>
                        </div>
                        <p className="leading-relaxed text-slate-600">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Formulario para añadir una respuesta al hilo */}
                  <form
                    onSubmit={(e) => handleSendReply(post.id, e)}
                    className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 sm:flex-row sm:items-center"
                  >
                    <select
                      value={replyRole}
                      onChange={(e) =>
                        setReplyRoleMap((prev) => ({
                          ...prev,
                          [post.id]: e.target.value as CommunityRole,
                        }))
                      }
                      className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700"
                    >
                      <option value="Gestor de Trámites">Gestor de Trámites</option>
                      <option value="Soporte Técnico">Soporte Técnico</option>
                      <option value="Personal Técnico">Personal Técnico</option>
                    </select>

                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) =>
                        setReplyTextMap((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      placeholder="Añadir aportación al debate..."
                      className="flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                    />

                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
                    >
                      Responder
                    </button>
                  </form>
                </div>

                {/* Botón de acción para aprobar e implantar la mejora */}
                {!isApproved && (
                  <div className="border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => onPromotePost(post)}
                      className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                    >
                      Aprobar e implantar en el trámite
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Columna derecha: Formulario para registrar una nueva incidencia */}
        <div className="self-start">
          <form
            onSubmit={handleCreatePost}
            className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <h3 className="text-sm font-bold text-slate-900">Registrar nueva incidencia</h3>
            <p className="text-xs text-slate-500">
              Abre un nuevo hilo para que técnicos y gestores analicen el problema.
            </p>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="new-role">
                Rol que reporta
              </label>
              <select
                id="new-role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as CommunityRole)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-700"
              >
                <option value="Soporte Técnico">Soporte Técnico</option>
                <option value="Gestor de Trámites">Gestor de Trámites</option>
                <option value="Personal Técnico">Personal Técnico</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="new-author">
                Nombre del informante
              </label>
              <input
                id="new-author"
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Ej. Laura M."
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="new-title">
                Título de la incidencia
              </label>
              <input
                id="new-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej. Dudas al firmar desde el teléfono móvil"
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="new-desc">
                Descripción del problema
              </label>
              <textarea
                id="new-desc"
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Explica qué dificultad encuentran los usuarios..."
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
            >
              Abrir hilo de debate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
