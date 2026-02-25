import { Undo, Redo } from "lucide-react";
import { EditorProps } from "../../../types";
import { useEditorState } from "@tiptap/react";

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
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!canUndo}
        className="p-2 rounded hover:bg-gray-200 transition-custom cursor-pointer text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        title="Отменить (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!canRedo}
        className="p-2 rounded hover:bg-gray-200 transition-custom cursor-pointer text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        title="Повторить (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};
