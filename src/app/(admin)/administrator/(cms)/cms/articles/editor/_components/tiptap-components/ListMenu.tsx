"use client";

import { List, ListOrdered } from "lucide-react";
import { Editor } from "@tiptap/react";

interface ListMenuProps {
  editor: Editor | null;
}

export const ListMenu = ({ editor }: ListMenuProps) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive("bulletList")
            ? "bg-gray-300 text-blue-600"
            : "text-gray-600"
        }`}
        title="Маркированный список"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
          editor.isActive("orderedList")
            ? "bg-gray-300 text-blue-600"
            : "text-gray-600"
        }`}
        title="Нумерованный список"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  );
};
