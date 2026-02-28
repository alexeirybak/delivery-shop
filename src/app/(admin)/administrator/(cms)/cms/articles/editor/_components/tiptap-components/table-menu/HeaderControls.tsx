import React from "react";
import { Rows, Columns, Square } from "lucide-react";

interface HeaderControlsProps {
  hasHeaderRow: boolean;
  hasHeaderColumn: boolean;
  isHeaderCell: boolean;
  isCellSelected: boolean;
  onToggleHeaderRow: () => void;
  onToggleHeaderColumn: () => void;
  onToggleHeaderCell: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  hasHeaderRow,
  hasHeaderColumn,
  isHeaderCell,
  isCellSelected,
  onToggleHeaderRow,
  onToggleHeaderColumn,
  onToggleHeaderCell,
}) => {
  return (
    <div className="table-button-group">
      <button
        type="button"
        onClick={onToggleHeaderRow}
        className={`table-menu-button ${hasHeaderRow ? "active" : ""}`}
        title="Строка заголовка"
      >
        <Rows className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onToggleHeaderColumn}
        className={`table-menu-button ${hasHeaderColumn ? "active" : ""}`}
        title="Столбец заголовка"
      >
        <Columns className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onToggleHeaderCell}
        disabled={!isCellSelected}
        className={`table-menu-button ${isHeaderCell ? "active" : ""} ${
          !isCellSelected ? "disabled" : ""
        }`}
        title={isCellSelected ? "Сделать ячейку заголовком" : "Выделите ячейку"}
      >
        <Square className="w-4 h-4" />
      </button>
    </div>
  );
};