import { Undo, Redo } from "lucide-react";
import { useEditorState } from "@tiptap/react";
import { EditorProps } from "../../types";
import "../../styles/history-menu.css";

export const HistoryMenu = ({ editor }: EditorProps) => {
  const { canUndo = false, canRedo = false } =
    useEditorState({
      editor,
      selector: (ctx) => ({
        canUndo: ctx.editor?.can().undo() ?? false,
        canRedo: ctx.editor?.can().redo() ?? false,
      }),
    }) ?? {};

  if (!editor) return null;

  return (
    <div className="history-menu">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!canUndo}
        className="history-button"
        title="Отменить (Ctrl+Z)"
      >
        <Undo />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!canRedo}
        className="history-button"
        title="Повторить (Ctrl+Y)"
      >
        <Redo />
      </button>
    </div>
  );
};