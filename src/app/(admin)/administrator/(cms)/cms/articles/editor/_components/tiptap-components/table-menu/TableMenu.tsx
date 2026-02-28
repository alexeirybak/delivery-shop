import { useState, useEffect } from "react";
import { Table, Trash2 } from "lucide-react";
import "./../../css/tableMenu.css";
import { EditorProps, NodeInfo } from "./../../../../types";
import { TableModal } from "./TableModal";
import { ColumnControls } from "./ColumnControls";
import { RowControls } from "./RowControls";
import { HeaderControls } from "./HeaderControls";
import { CellControls } from "./CellControls";

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

  const [tableState, setTableState] = useState({
    hasHeaderRow: false,
    hasHeaderColumn: false,
    isHeaderCell: false,
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

      const hasHeaderRow = editor.isActive("table", { headerRow: true });
      const hasHeaderColumn = editor.isActive("table", { headerColumn: true });
      const isHeaderCell = editor.isActive("tableHeader");

      setSelectionState({
        isCellSelected,
        hasMultipleCellsSelected: hasMultipleCellsSelected || canMergeCells,
        isTableSelected,
        selectionRange: { from, to },
      });

      setTableState({
        hasHeaderRow,
        hasHeaderColumn,
        isHeaderCell,
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

  const addColumnBefore = () => editor.chain().focus().addColumnBefore().run();
  const addColumnAfter = () => editor.chain().focus().addColumnAfter().run();
  const deleteColumn = () => editor.chain().focus().deleteColumn().run();
  const addRowBefore = () => editor.chain().focus().addRowBefore().run();
  const addRowAfter = () => editor.chain().focus().addRowAfter().run();
  const deleteRow = () => editor.chain().focus().deleteRow().run();
  const deleteTable = () => editor.chain().focus().deleteTable().run();
  const toggleHeaderRow = () => editor.chain().focus().toggleHeaderRow().run();
  const toggleHeaderColumn = () => editor.chain().focus().toggleHeaderColumn().run();
  const toggleHeaderCell = () => editor.chain().focus().toggleHeaderCell().run();

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

  const canModifyTable = selectionState.isCellSelected || selectionState.isTableSelected;

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
          <div>
            <div className="table-menu-divider" />

            <ColumnControls
              onAddBefore={addColumnBefore}
              onAddAfter={addColumnAfter}
              onDelete={deleteColumn}
            />

            <RowControls
              onAddBefore={addRowBefore}
              onAddAfter={addRowAfter}
              onDelete={deleteRow}
            />

            <div className="table-menu-divider" />

            <HeaderControls
              hasHeaderRow={tableState.hasHeaderRow}
              hasHeaderColumn={tableState.hasHeaderColumn}
              isHeaderCell={tableState.isHeaderCell}
              isCellSelected={selectionState.isCellSelected}
              onToggleHeaderRow={toggleHeaderRow}
              onToggleHeaderColumn={toggleHeaderColumn}
              onToggleHeaderCell={toggleHeaderCell}
            />

            <div className="table-menu-divider" />

            <CellControls
              hasMultipleCellsSelected={selectionState.hasMultipleCellsSelected}
              isCellSelected={selectionState.isCellSelected}
              onMerge={handleMergeCells}
              onSplit={handleSplitCell}
            />

            <div className="table-menu-divider" />

            <button
              type="button"
              onClick={deleteTable}
              className="table-menu-button delete"
              title="Удалить таблицу"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
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