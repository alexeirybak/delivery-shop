import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { EditorProps } from "../../../types";
import { useEffect, useState } from "react";
 
export const AlignmentMenu = ({ editor }: EditorProps) => {
  const [, setUpdate] = useState(0);
 
  useEffect(() => {
    if (!editor) return;
 
    const handleUpdate = () => {
      setUpdate(prev => prev + 1);
    };
 
    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);
 
    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);
 
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editor) return;
 
      if (event.ctrlKey && event.shiftKey) {
        event.preventDefault();
 
        editor.commands.focus();
 
        switch (event.code) {
          case "KeyL":
            editor.commands.setTextAlign("left");
            break;
 
          case "KeyC":
            editor.commands.setTextAlign("center");
            break;
 
          case "KeyR":
            editor.commands.setTextAlign("right");
            break;
 
          case "KeyJ":
            editor.commands.setTextAlign("justify");
            break;
 
          default:
            return;
        }
      }
    };
 
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor]);
 
  if (!editor) return null;
 
  const setAlignment = (align: "left" | "center" | "right" | "justify") => {
    editor.commands.focus();
    editor.commands.setTextAlign(align);
  };
 
  const buttons = [
    {
      icon: <AlignLeft className="w-4 h-4" />,
      title: "По левому краю",
      align: "left" as const,
      shortcut: "Ctrl+Shift+L",
    },
    {
      icon: <AlignCenter className="w-4 h-4" />,
      title: "По центру",
      align: "center" as const,
      shortcut: "Ctrl+Shift+C",
    },
    {
      icon: <AlignRight className="w-4 h-4" />,
      title: "По правому краю",
      align: "right" as const,
      shortcut: "Ctrl+Shift+R",
    },
    {
      icon: <AlignJustify className="w-4 h-4" />,
      title: "По ширине",
      align: "justify" as const,
      shortcut: "Ctrl+Shift+J",
    },
  ];
 
  return (
    <div className="flex items-center gap-1">
      {buttons.map((button, index) => {
        const isActive = editor.isActive({ textAlign: button.align });
        return (
          <button
            key={index}
            type="button"
            onClick={() => setAlignment(button.align)}
            className={`
              p-2 rounded duration-300 cursor-pointer
              ${
                isActive
                  ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
            title={`${button.title} (${button.shortcut})`}
          >
            {button.icon}
          </button>
        );
      })}
    </div>
  );
};