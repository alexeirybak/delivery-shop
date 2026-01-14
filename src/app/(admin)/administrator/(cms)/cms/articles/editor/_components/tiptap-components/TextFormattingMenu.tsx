"use client";

import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { EditorProps } from "../../../types";

export const TextFormattingMenu = ({ editor }: EditorProps) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive("bold")
            ? "bg-gray-300 text-green-600"
            : "text-gray-600"
        }`}
        title="Жирный"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive("italic")
            ? "bg-gray-300 text-green-600"
            : "text-gray-600"
        }`}
        title="Курсив"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive("underline")
            ? "bg-gray-300 text-green-600"
            : "text-gray-600"
        }`}
        title="Подчеркнутый"
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive("strike")
            ? "bg-gray-300 text-green-600"
            : "text-gray-600"
        }`}
        title="Зачеркнутый"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
    </div>
  );
};
