import React from "react";

interface TablePreviewProps {
  rows: number;
  cols: number;
  withHeaderRow: boolean;
}

export const TablePreview: React.FC<TablePreviewProps> = ({
  rows,
  cols,
  withHeaderRow,
}) => {
  return (
    <div className="table-preview-container">
      <p className="table-preview-title">Предпросмотр:</p>
      <div className="table-preview-grid">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="table-preview-row">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`table-preview-cell ${
                  rowIndex === 0 && withHeaderRow ? "header" : ""
                }`}
              >
                {rowIndex === 0 && withHeaderRow ? "H" : "C"}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="table-preview-hint">
        {withHeaderRow ? "H - заголовок, C - ячейка" : "C - ячейка"}
      </p>
    </div>
  );
};