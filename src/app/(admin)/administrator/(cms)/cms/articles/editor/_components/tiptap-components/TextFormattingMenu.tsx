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
        className={`p-2 rounded duration-300 cursor-pointer ${
          editor.isActive("bold")
            ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        title="Жирный"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded duration-300 cursor-pointer ${
          editor.isActive("italic")
            ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        title="Курсив"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded duration-300 cursor-pointer ${
          editor.isActive("underline")
            ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        title="Подчеркнутый"
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded duration-300 cursor-pointer ${
          editor.isActive("strike")
            ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        title="Зачеркнутый"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
    </div>
  );
};
