"use client";

import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { EditorProps } from "../../../types";

export const AlignmentMenu = ({ editor }: EditorProps) => {
  if (!editor) return null;

  const buttons = [
    {
      icon: <AlignLeft className="w-4 h-4" />,
      title: "По левому краю",
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      shortcut: "Ctrl+Shift+L"
    },
    {
      icon: <AlignCenter className="w-4 h-4" />,
      title: "По центру",
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      shortcut: "Ctrl+Shift+E"
    },
    {
      icon: <AlignRight className="w-4 h-4" />,
      title: "По правому краю",
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      shortcut: "Ctrl+Shift+R"
    },
    {
      icon: <AlignJustify className="w-4 h-4" />,
      title: "По ширине",
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editor.isActive({ textAlign: "justify" }),
      shortcut: "Ctrl+Shift+J"
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