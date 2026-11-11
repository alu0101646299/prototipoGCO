import { Icon } from "./Icons";
import { seciStages } from "../data/mockData";
import type { SeciPhase } from "../types/tramita";

export function SeciModelCard({
  selectedPhase,
  onSelectPhase,
}: {
  selectedPhase: SeciPhase | "all";
  onSelectPhase: (phase: SeciPhase | "all") => void;
}) {
  return (
    <div className="seci-card-container">
      <div className="seci-header">
        <div>
          <span className="badge badge-purple" style={{ marginBottom: "4px", display: "inline-block" }}>
            MODELO DE GESTIÓN DEL CONOCIMIENTO (NONAKA &amp; TAKEUCHI)
          </span>
          <h4>Espiral SECI: Conversión de Conocimiento Tácito a Explícito</h4>
        </div>
        {selectedPhase !== "all" && (
          <button
            className="text-link"
            onClick={() => onSelectPhase("all")}
            style={{ fontSize: "11px" }}
          >
            Mostrar todas las fases
          </button>
        )}
      </div>
      <div className="seci-grid">
        {seciStages.map((stage, idx) => {
          const isSelected = selectedPhase === stage.phase;
          return (
            <button
              type="button"
              key={stage.phase}
              className={`seci-stage-box ${isSelected ? "active" : ""}`}
              onClick={() => onSelectPhase(isSelected ? "all" : stage.phase)}
            >
              <div className="seci-stage-top">
                <span className="seci-step-num" style={{ background: stage.badgeColor }}>
                  {idx + 1}. {stage.phase}
                </span>
                <span className="seci-conversion">{stage.conversion}</span>
              </div>
              <strong>{stage.title}</strong>
              <p>{stage.description}</p>
              <div className="seci-actor">
                <Icon name="users" size={12} />
                <span>{stage.actor}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
