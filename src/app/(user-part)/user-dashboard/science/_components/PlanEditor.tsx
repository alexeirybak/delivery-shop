import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface PlanEditorProps {
  initialContent: string;
  onUpdatePlan: (planContent: string) => void;
  onCancel: () => void;
}

export const PlanEditor = ({
  initialContent,
  onUpdatePlan,
  onCancel,
}: PlanEditorProps) => {
  const [editingPlanContent, setEditingPlanContent] = useState(initialContent);

  const handleUpdate = () => {
    if (!editingPlanContent.trim()) return;
    onUpdatePlan(editingPlanContent);
  };

  return (
    <div className="plan-editor">
      <textarea
        value={editingPlanContent}
        onChange={(e) => setEditingPlanContent(e.target.value)}
        className="plan-editor-textarea"
        rows={10}
        placeholder="Редактируйте план статьи..."
      />
      <div className="plan-editor-buttons">
        <button onClick={handleUpdate} className="plan-update-btn">
          <CheckCircle size={16} className="btn-icon" />
          Обновить план
        </button>
        <button onClick={onCancel} className="plan-cancel-btn">
          <XCircle size={16} className="btn-icon" />
          Отмена
        </button>
      </div>
    </div>
  );
};