"use client";

import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { Editor } from "@tiptap/react";

interface AlignmentMenuProps {
  editor: Editor | null;
}

export const AlignmentMenu = ({ editor }: AlignmentMenuProps) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 mr-2">Выравнивание:</span>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive({ textAlign: "left" })
            ? "bg-gray-300 text-blue-600"
            : "text-gray-600"
        }`}
        title="По левому краю"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive({ textAlign: "center" })
            ? "bg-gray-300 text-blue-600"
            : "text-gray-600"
        }`}
        title="По центру"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive({ textAlign: "right" })
            ? "bg-gray-300 text-blue-600"
            : "text-gray-600"
        }`}
        title="По правому краю"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive({ textAlign: "right" })
            ? "bg-gray-300 text-blue-600"
            : "text-gray-600"
        }`}
        title="По правому краю"
      >
        <AlignJustify className="w-4 h-4" />
      </button>
    </div>
  );
};
