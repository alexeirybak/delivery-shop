import React from "react";
import { Plus, Minus, Rows, ChevronUp, ChevronDown } from "lucide-react";

interface RowControlsProps {
  onAddBefore: () => void;
  onAddAfter: () => void;
  onDelete: () => void;
}

export const RowControls: React.FC<RowControlsProps> = ({
  onAddBefore,
  onAddAfter,
  onDelete,
}) => {
  return (
    <div className="table-button-group">
      <span className="table-group-label">Строки:</span>
      <button
        type="button"
        onClick={onAddBefore}
        className="table-menu-button"
        title="Добавить строку сверху"
      >
        <ChevronUp className="w-3 h-3" />
        <Plus className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={onAddAfter}
        className="table-menu-button"
        title="Добавить строку снизу"
      >
        <Plus className="w-3 h-3" />
        <ChevronDown className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="table-menu-button"
        title="Удалить строку"
      >
        <Minus className="w-3 h-3" />
        <Rows className="w-3 h-3" />
      </button>
    </div>
  );
};