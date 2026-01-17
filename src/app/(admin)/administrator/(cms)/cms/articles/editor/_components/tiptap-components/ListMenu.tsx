"use client";

import { List, ListOrdered } from "lucide-react";
import { EditorProps } from "../../../types";

export const ListMenu = ({ editor }: EditorProps) => {
  if (!editor) return null;

  const buttons = [
    {
      icon: <List className="w-4 h-4" />,
      title: "Маркированный список",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      shortcut: "Ctrl+Shift+8"
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      title: "Нумерованный список",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      shortcut: "Ctrl+Shift+9"
    }
  ];

  return (
    <div className="flex items-center gap-1">
      {buttons.map((button, index) => (
        <button
          key={index}
          type="button"
          onClick={button.action}
          className={`
            p-2 rounded duration-300 cursor-pointer
            ${button.isActive
              ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
              : "text-gray-700 hover:bg-gray-100"
            }
          `}
          title={`${button.title} (${button.shortcut})`}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};