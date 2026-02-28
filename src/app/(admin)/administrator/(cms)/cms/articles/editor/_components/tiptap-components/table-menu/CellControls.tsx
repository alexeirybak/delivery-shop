import React from "react";
import { Combine, Split } from "lucide-react";

interface CellControlsProps {
  hasMultipleCellsSelected: boolean;
  isCellSelected: boolean;
  onMerge: () => void;
  onSplit: () => void;
}

export const CellControls: React.FC<CellControlsProps> = ({
  hasMultipleCellsSelected,
  isCellSelected,
  onMerge,
  onSplit,
}) => {
  return (
    <div className="table-button-group">
      <span className="table-group-label">Ячейки:</span>
      <button
        type="button"
        onClick={onMerge}
        disabled={!hasMultipleCellsSelected}
        className={`table-menu-button ${
          hasMultipleCellsSelected ? "" : "disabled"
        }`}
        title={
          hasMultipleCellsSelected
            ? "Объединить выделенные ячейки"
            : "Выделите несколько ячеек для объединения"
        }
      >
        <Combine className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onSplit}
        disabled={!isCellSelected || hasMultipleCellsSelected}
        className={`table-menu-button ${
          isCellSelected && !hasMultipleCellsSelected ? "" : "disabled"
        }`}
        title={
          isCellSelected && !hasMultipleCellsSelected
            ? "Разделить ячейку"
            : "Выделите одну ячейку для разделения"
        }
      >
        <Split className="w-4 h-4" />
      </button>
    </div>
  );
};