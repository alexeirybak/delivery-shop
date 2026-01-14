"use client";

import { useState, useEffect } from "react";

import {
  Table,
  Trash2,
  Plus,
  Minus,
  Rows,
  Columns,
  Square,
  Combine,
  Split,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { Node } from "prosemirror-model";
import "../../css/tableMenu.css";
import { EditorProps } from "../../../types";

interface NodeInfo {
  node: Node;
  pos: number;
  type: string;
}

export const TableMenu = ({ editor }: EditorProps) => {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);
  const [selectionState, setSelectionState] = useState({
    isCellSelected: false,
    hasMultipleCellsSelected: false,
    isTableSelected: false,
    selectionRange: { from: 0, to: 0 },
  });

  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const isCellSelected =
        editor.isActive("tableCell") || editor.isActive("tableHeader");
      const isTableSelected = editor.isActive("table");
      const { from, to } = editor.state.selection;

      const hasSelectionRange = to - from > 1;

      let hasMultipleCellsSelected = false;

      if (hasSelectionRange) {
        const nodes: NodeInfo[] = [];
        editor.state.doc.nodesBetween(from, to, (node, pos) => {
          nodes.push({ node, pos, type: node.type.name });
        });

        const cellNodes = nodes.filter(
          (n) => n.type === "tableCell" || n.type === "tableHeader"
        );

        hasMultipleCellsSelected = cellNodes.length > 1;
      }

      const canMergeCells = editor.can().mergeCells();

      setSelectionState({
        isCellSelected,
        hasMultipleCellsSelected: hasMultipleCellsSelected || canMergeCells,
        isTableSelected,
        selectionRange: { from, to },
      });
    };

    editor.on("selectionUpdate", updateSelection);
    editor.on("transaction", updateSelection);
    updateSelection();

    return () => {
      editor.off("selectionUpdate", updateSelection);
      editor.off("transaction", updateSelection);
    };
  }, [editor]);

  if (!editor) return null;

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
    setIsTableModalOpen(false);
    setRows(3);
    setCols(3);
    setWithHeaderRow(true);
  };

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const toggleHeaderRow = () => {
    editor.chain().focus().toggleHeaderRow().run();
  };

  const toggleHeaderColumn = () => {
    editor.chain().focus().toggleHeaderColumn().run();
  };

  const toggleHeaderCell = () => {
    editor.chain().focus().toggleHeaderCell().run();
  };

  const handleMergeCells = () => {
    if (selectionState.hasMultipleCellsSelected || editor.can().mergeCells()) {
      editor.chain().focus().mergeCells().run();
    }
  };

  const handleSplitCell = () => {
    if (
      selectionState.isCellSelected &&
      !selectionState.hasMultipleCellsSelected
    ) {
      editor.chain().focus().splitCell().run();
    }
  };

  const canModifyTable = selectionState.isTableSelected;

  return (
    <>
      <div className="table-menu-container">
        <span className="table-group-label">Таблицы:</span>

        <button
          type="button"
          onClick={() => setIsTableModalOpen(true)}
          className={`table-menu-button ${
            selectionState.isTableSelected ? "active" : ""
          }`}
          title="Вставить таблицу"
        >
          <Table className="w-4 h-4" />
        </button>

        {canModifyTable && (
          <>
            <div className="table-menu-divider"></div>

            <div className="table-button-group">
              <span className="table-group-label">Столбцы:</span>
              <button
                type="button"
                onClick={addColumnBefore}
                className="table-menu-button"
                title="Добавить столбец слева"
              >
                <ChevronLeft className="w-3 h-3" />
                <Plus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={addColumnAfter}
                className="table-menu-button"
                title="Добавить столбец справа"
              >
                <Plus className="w-3 h-3" />
                <ChevronRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={deleteColumn}
                className="table-menu-button"
                title="Удалить столбец"
              >
                <Minus className="w-3 h-3" />
                <Columns className="w-3 h-3" />
              </button>
            </div>

            <div className="table-button-group">
              <span className="table-group-label">Строки:</span>
              <button
                type="button"
                onClick={addRowBefore}
                className="table-menu-button"
                title="Добавить строку сверху"
              >
                <ChevronUp className="w-3 h-3" />
                <Plus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={addRowAfter}
                className="table-menu-button"
                title="Добавить строку снизу"
              >
                <Plus className="w-3 h-3" />
                <ChevronDown className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={deleteRow}
                className="table-menu-button"
                title="Удалить строку"
              >
                <Minus className="w-3 h-3" />
                <Rows className="w-3 h-3" />
              </button>
            </div>

            <div className="table-menu-divider"></div>

            <div className="table-button-group">
              <button
                type="button"
                onClick={toggleHeaderRow}
                className={`table-menu-button ${
                  editor.isActive("tableHeader") ? "active" : ""
                }`}
                title="Строка заголовка"
              >
                <Rows className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={toggleHeaderColumn}
                className={`table-menu-button ${
                  editor.isActive("tableCell") ? "active" : ""
                }`}
                title="Столбец заголовка"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={toggleHeaderCell}
                className={`table-menu-button ${
                  editor.isActive("tableCell") ? "active" : ""
                }`}
                title="Ячейка заголовка"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>

            <div className="table-menu-divider"></div>

            <div className="table-button-group">
              <span className="table-group-label">Ячейки:</span>

              <button
                type="button"
                onClick={handleMergeCells}
                disabled={!selectionState.hasMultipleCellsSelected}
                className={`table-menu-button ${
                  selectionState.hasMultipleCellsSelected ? "" : "disabled"
                }`}
                title={
                  selectionState.hasMultipleCellsSelected
                    ? "Объединить выделенные ячейки"
                    : "Выделите несколько ячеек для объединения"
                }
              >
                <Combine className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSplitCell}
                disabled={
                  !selectionState.isCellSelected ||
                  selectionState.hasMultipleCellsSelected
                }
                className={`table-menu-button ${
                  selectionState.isCellSelected &&
                  !selectionState.hasMultipleCellsSelected
                    ? ""
                    : "disabled"
                }`}
                title={
                  selectionState.isCellSelected &&
                  !selectionState.hasMultipleCellsSelected
                    ? "Разделить ячейку"
                    : "Выделите одну ячейку для разделения"
                }
              >
                <Split className="w-4 h-4" />
              </button>
            </div>

            <div className="table-menu-divider"></div>

            <button
              type="button"
              onClick={deleteTable}
              className="table-menu-button delete"
              title="Удалить таблицу"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {isTableModalOpen && (
        <div className="table-modal-overlay">
          <div className="table-modal-content">
            <div className="table-modal-header">
              <h3 className="table-modal-title">Создать таблицу</h3>
            </div>

            <div className="table-modal-body">
              <div className="table-form-group">
                <label htmlFor="rows" className="table-form-label">
                  Количество строк
                </label>
                <div className="table-range-container">
                  <input
                    id="rows"
                    type="range"
                    min="1"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value))}
                    className="table-range-input"
                  />
                  <span className="table-range-value">{rows}</span>
                </div>
              </div>

              <div className="table-form-group">
                <label htmlFor="cols" className="table-form-label">
                  Количество столбцов
                </label>
                <div className="table-range-container">
                  <input
                    id="cols"
                    type="range"
                    min="1"
                    max="10"
                    value={cols}
                    onChange={(e) => setCols(parseInt(e.target.value))}
                    className="table-range-input"
                  />
                  <span className="table-range-value">{cols}</span>
                </div>
              </div>

              <div className="table-form-group">
                <div className="table-checkbox-container">
                  <input
                    id="header"
                    type="checkbox"
                    checked={withHeaderRow}
                    onChange={(e) => setWithHeaderRow(e.target.checked)}
                    className="table-checkbox"
                  />
                  <label htmlFor="header" className="table-checkbox-label">
                    Добавить строку заголовка
                  </label>
                </div>
              </div>

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
            </div>

            <div className="table-modal-footer">
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="table-modal-button cancel"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="table-modal-button insert"
              >
                Вставить таблицу
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
