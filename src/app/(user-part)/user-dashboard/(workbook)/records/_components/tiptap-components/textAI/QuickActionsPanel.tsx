import { Sparkles } from "lucide-react";
import { quickActions } from "../../../utils/quickActions";
import { QuickActionsPanelProps } from "../../../types";
import "../../../styles/quick-actions-panel.css";

export const QuickActionsPanel = ({
  onActionClick,
  isGenerating,
}: QuickActionsPanelProps) => {
  return (
    <div className="quick-actions-panel">
      <div className="quick-actions-header">
        <Sparkles />
        <h3>Быстрые действия (работают с выделенным в редакторе текстом):</h3>
      </div>
      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <button
            type="button"
            key={action.id}
            onClick={() => onActionClick(action.id)}
            disabled={isGenerating}
            className="quick-action-btn"
            title={action.desc}
            data-action={action.id}
          >
            <div className="quick-action-icon" data-action={action.id}>
              {action.icon}
            </div>
            <div className="quick-action-content">
              <div className="quick-action-label">{action.label}</div>
              <div className="quick-action-desc">{action.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
