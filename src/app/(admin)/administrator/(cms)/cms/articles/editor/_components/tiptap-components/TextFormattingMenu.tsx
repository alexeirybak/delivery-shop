"use client";

import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { EditorProps } from "../../../types";

export const TextFormattingMenu = ({ editor }: EditorProps) => {
  if (!editor) return null;


  const canBold = editor.can().chain().focus().toggleBold().run();
  const canItalic = editor.can().chain().focus().toggleItalic().run();
  const canUnderline = editor.can().chain().focus().toggleUnderline().run();
  const canStrike = editor.can().chain().focus().toggleStrike().run();

  const buttons = [
    {
      icon: <Bold className="w-4 h-4" />,
      title: "Жирный",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      canDo: canBold,
      shortcut: "Ctrl+B"
    },
    {
      icon: <Italic className="w-4 h-4" />,
      title: "Курсив",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      canDo: canItalic,
      shortcut: "Ctrl+I"
    },
    {
      icon: <Underline className="w-4 h-4" />,
      title: "Подчеркнутый",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      canDo: canUnderline,
      shortcut: "Ctrl+U"
    },
    {
      icon: <Strikethrough className="w-4 h-4" />,
      title: "Зачеркнутый",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      canDo: canStrike,
      shortcut: "Ctrl+Shift+S"
    },
  ];

  return ( 
    <div className="flex items-center gap-1">
      {buttons.map((button, index) => (
        <button
          key={index}
          type="button"
          onClick={button.action}
          disabled={!button.canDo}
          className={`
            p-2 rounded duration-300 
            ${!button.canDo 
              ? "opacity-40 cursor-not-allowed text-gray-400" 
              : button.isActive
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200 cursor-pointer"
                : "text-gray-700 hover:bg-gray-100 cursor-pointer"
            }
          `}
          title={`${button.title} (${button.shortcut})${!button.canDo ? " - недоступно" : ""}`}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};