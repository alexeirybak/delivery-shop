import { useState, useEffect } from "react";
import { Table, Trash2, Plus, Minus, Merge, Split, ChevronDown, ChevronUp } from "lucide-react";
import { TableModal } from "./TableModal";
import { EditorProps } from "../../types";
import "../../styles/table-menu.css";

export const TableMenu = ({ editor }: EditorProps) => {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);
  const [canModify, setCanModify] = useState(false);
  const [hasHeaderRow, setHasHeaderRow] = useState(false);
  const [canMerge, setCanMerge] = useState(false);
  const [canSplit, setCanSplit] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateState = () => {
      const isTableActive = editor.isActive("tableCell") || editor.isActive("tableHeader") || editor.isActive("table");
      
      setCanModify(isTableActive);
      setHasHeaderRow(editor.isActive("table", { headerRow: true }));
      setCanMerge(editor.can().mergeCells());
      setCanSplit(editor.can().splitCell());
    };

    editor.on("selectionUpdate", updateState);
    editor.on("transaction", updateState);
    updateState();

    return () => {
      editor.off("selectionUpdate", updateState);
      editor.off("transaction", updateState);
    };
  }, [editor]);

  if (!editor) return null;

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
    setIsTableModalOpen(false);
  };

  const handleSplitCell = () => {
    if (canSplit) {
      editor.chain().focus().splitCell().run();
    }
  };

  return (
    <>
      <div className="table-menu-container">
        <button
          type="button"
          onClick={() => setIsTableModalOpen(true)}
          className="table-menu-button"
          title="Вставить таблицу"
        >
          <Table />
        </button>

        {canModify && (
          <>
            <span className="table-menu-divider" />

            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="table-menu-button"
              title="Добавить столбец слева"
            >
              <Plus />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="table-menu-button"
              title="Добавить строку выше"
            >
              <ChevronUp />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="table-menu-button"
              title="Добавить строку ниже"
            >
              <ChevronDown />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="table-menu-button"
              title="Удалить столбец"
            >
              <Minus />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="table-menu-button"
              title="Удалить строку"
            >
              <Minus />|
            </button>

            <span className="table-menu-divider" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              className={`table-menu-button ${hasHeaderRow ? "active" : ""}`}
              title="Строка-заголовок"
            >
              H
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().mergeCells().run()}
              disabled={!canMerge}
              className={`table-menu-button ${!canMerge ? "disabled" : ""}`}
              title="Объединить выделенные ячейки"
            >
              <Merge />
            </button>

            <button
              type="button"
              onClick={handleSplitCell}
              disabled={!canSplit}
              className={`table-menu-button ${!canSplit ? "disabled" : ""}`}
              title="Разделить объединенную ячейку"
            >
              <Split />
            </button>

            <span className="table-menu-divider" />

            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="table-menu-button delete"
              title="Удалить таблицу"
            >
              <Trash2 />
            </button>
          </>
        )}
      </div>

      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        rows={rows}
        cols={cols}
        withHeaderRow={withHeaderRow}
        onRowsChange={setRows}
        onColsChange={setCols}
        onHeaderChange={setWithHeaderRow}
        onInsert={insertTable}
      />
    </>
  );
};