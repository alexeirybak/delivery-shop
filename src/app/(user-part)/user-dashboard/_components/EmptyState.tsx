import { Sparkles } from "lucide-react";
import { EmptyStateProps } from "../types";
import "../styles/pages-empty-state.css";

export const EmptyState = ({ modeLabel, modeDescription }: EmptyStateProps) => {
  return (
    <div className="chat-empty">
      <Sparkles size={48} className="empty-icon" />
      <div className="mode-hint">
        <p>
          Текущий режим: <strong>{modeLabel}</strong>
        </p>
        {modeDescription && (
          <p dangerouslySetInnerHTML={{ __html: modeDescription }} />
        )}
      </div>
    </div>
  );
};
