"use client";

import { Undo, Redo } from "lucide-react";
import { Editor } from "@tiptap/react";

interface HistoryMenuProps {
  editor: Editor | null;
}

export const HistoryMenu = ({ editor }: HistoryMenuProps) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        title="Отменить (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        title="Повторить (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};
