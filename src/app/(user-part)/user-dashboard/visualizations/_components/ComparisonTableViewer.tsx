"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Maximize2,
  Save,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { ComparisonTableData } from "../types/visualizations.types";
import "../styles/comparison-table-viewer.css";

interface ComparisonTableViewerProps {
  data: ComparisonTableData;
  onClose?: () => void;
  onSave?: (data: ComparisonTableData) => void;
  isSaving?: boolean;
}

function ComparisonTableViewerContent({
  data,
  onSave,
  isSaving,
}: ComparisonTableViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"header" | "cell" | "rowHeader">(
    "cell",
  );
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [editColIndex, setEditColIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const isInitialized = useRef(false);

  // Инициализируем данные сразу с rowHeaders
  const getInitialData = (): ComparisonTableData => {
    if (data.rowHeaders) {
      return data;
    }
    return {
      ...data,
      rowHeaders: data.rows.map((_, i) => `Строка ${i + 1}`),
    };
  };

  const [chartData, setChartData] =
    useState<ComparisonTableData>(getInitialData());

  // Обновляем данные только при первом рендере
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
    }
  }, []);

  const handleSave = () => {
    if (onSave) {
      onSave(chartData);
    }
  };

  const handleAddRow = () => {
    const valuesCount = chartData.headers.length - 1;
    const newValues = Array(valuesCount).fill("Новое значение");
    const newRowName = `Новый критерий ${chartData.rows.length + 1}`;

    setChartData({
      ...chartData,
      rows: [...chartData.rows, [newRowName, ...newValues]],
    });
  };

  const handleAddColumn = () => {
    const newHeader = `Столбец ${chartData.headers.length}`;
    const newHeaders = [...chartData.headers, newHeader];
    const newRows = chartData.rows.map((row) => [...row, "Новое значение"]);
    setChartData({
      ...chartData,
      headers: newHeaders,
      rows: newRows,
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (chartData.rows.length <= 1) {
      alert("Должна быть хотя бы одна строка");
      return;
    }
    setChartData({
      ...chartData,
      rows: chartData.rows.filter((_, i) => i !== rowIndex),
      rowHeaders: chartData.rowHeaders?.filter((_, i) => i !== rowIndex),
    });
  };

  const handleDeleteColumn = (colIndex: number) => {
    if (chartData.headers.length <= 2) {
      alert("Должен быть хотя бы один столбец для сравнения");
      return;
    }
    const newHeaders = chartData.headers.filter((_, i) => i !== colIndex);
    const newRows = chartData.rows.map((row) =>
      row.filter((_, i) => i !== colIndex - 1),
    );
    setChartData({
      ...chartData,
      headers: newHeaders,
      rows: newRows,
    });
  };

  const handleEditHeader = (colIndex: number) => {
    setEditMode("header");
    setEditColIndex(colIndex);
    setEditRowIndex(null);
    setEditValue(chartData.headers[colIndex]);
    setIsEditing(true);
  };

  const handleEditRowHeader = (rowIndex: number) => {
    setEditMode("rowHeader");
    setEditRowIndex(rowIndex);
    setEditColIndex(null);
    setEditValue(chartData.rowHeaders?.[rowIndex] || `Строка ${rowIndex + 1}`);
    setIsEditing(true);
  };

  const handleEditCell = (rowIndex: number, colIndex: number) => {
    setEditMode("cell");
    setEditRowIndex(rowIndex);
    setEditColIndex(colIndex);
    setEditValue(chartData.rows[rowIndex][colIndex]);
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editMode === "header" && editColIndex !== null && editValue.trim()) {
      const newHeaders = [...chartData.headers];
      newHeaders[editColIndex] = editValue.trim();
      setChartData({ ...chartData, headers: newHeaders });
    } else if (
      editMode === "rowHeader" &&
      editRowIndex !== null &&
      editValue.trim()
    ) {
      const newRowHeaders = [...(chartData.rowHeaders || [])];
      newRowHeaders[editRowIndex] = editValue.trim();
      setChartData({ ...chartData, rowHeaders: newRowHeaders });
    } else if (
      editMode === "cell" &&
      editRowIndex !== null &&
      editColIndex !== null &&
      editValue.trim()
    ) {
      const newRows = [...chartData.rows];
      newRows[editRowIndex][editColIndex] = editValue.trim();
      setChartData({ ...chartData, rows: newRows });
    }
    setIsEditing(false);
    setEditMode("cell");
    setEditRowIndex(null);
    setEditColIndex(null);
    setEditValue("");
  };

  const downloadCSV = () => {
    const csvRows = [];

    // Заголовки
    csvRows.push(chartData.headers.join(","));

    // Данные
    for (let i = 0; i < chartData.rows.length; i++) {
      const rowHeader = chartData.rowHeaders?.[i] || `Строка ${i + 1}`;
      csvRows.push([rowHeader, ...chartData.rows[i]].join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "comparison-table.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const jsonStr = JSON.stringify(chartData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "comparison-table.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} className="comparison-table-container">
      <div className="comparison-table-toolbar">
        <div className="comparison-table-toolbar-divider" />
        <button
          onClick={handleAddRow}
          className="comparison-table-toolbar-btn"
          title="Добавить строку"
        >
          <Plus size={16} />
          <span>Строка</span>
        </button>
        <button
          onClick={handleAddColumn}
          className="comparison-table-toolbar-btn"
          title="Добавить столбец"
        >
          <Plus size={16} />
          <span>Столбец</span>
        </button>
        <div className="comparison-table-toolbar-divider" />
        <button
          onClick={downloadCSV}
          className="comparison-table-toolbar-btn"
          title="Скачать как CSV"
        >
          <Download size={16} />
          <span>CSV</span>
        </button>
        <button
          onClick={downloadJSON}
          className="comparison-table-toolbar-btn"
          title="Скачать как JSON"
        >
          <Download size={16} />
          <span>JSON</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="comparison-table-toolbar-btn"
          title="Полный экран"
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>

        {onSave && (
          <>
            <div className="comparison-table-toolbar-divider" />
            <button
              onClick={handleSave}
              className="comparison-table-toolbar-btn"
              title="Сохранить изменения"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
          </>
        )}
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="comparison-table-header">Характеристика</th>
              {chartData.headers.slice(1).map((header, colIndex) => (
                <th key={colIndex} className="comparison-table-header">
                  <div className="comparison-table-header-content">
                    <span>{header}</span>
                    <div className="comparison-table-header-actions">
                      <button
                        onClick={() => handleEditHeader(colIndex + 1)}
                        className="comparison-table-header-edit"
                        title="Редактировать"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteColumn(colIndex + 1)}
                        className="comparison-table-header-delete"
                        title="Удалить столбец"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td
                  className="comparison-table-row-header"
                  onClick={() => handleEditRowHeader(rowIndex)}
                >
                  <div className="comparison-table-cell-content">
                    <span>{row[0]}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRow(rowIndex);
                      }}
                      className="comparison-table-row-delete"
                      title="Удалить строку"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
                {row.slice(1).map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="comparison-table-cell"
                    onClick={() => handleEditCell(rowIndex, colIndex)}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-table-info-panel">
        <span>Кликните на ячейку для редактирования</span>
      </div>

      {isEditing && (
        <div className="comparison-table-edit-modal">
          <div className="comparison-table-edit-modal-content">
            <h3 className="comparison-table-edit-modal-title">
              {editMode === "header"
                ? "Редактировать заголовок"
                : editMode === "rowHeader"
                  ? "Редактировать название строки"
                  : "Редактировать значение"}
            </h3>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="comparison-table-edit-modal-input"
              autoFocus
              placeholder={
                editMode === "header"
                  ? "Название столбца"
                  : editMode === "rowHeader"
                    ? "Название строки"
                    : "Значение"
              }
            />
            <div className="comparison-table-edit-modal-actions">
              <button
                onClick={() => setIsEditing(false)}
                className="comparison-table-edit-modal-btn cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleEditSubmit}
                className="comparison-table-edit-modal-btn save"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const ComparisonTableViewer = (props: ComparisonTableViewerProps) => {
  return <ComparisonTableViewerContent {...props} />;
};
