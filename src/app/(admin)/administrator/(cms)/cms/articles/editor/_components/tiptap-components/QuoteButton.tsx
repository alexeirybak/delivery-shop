import { Quote } from "lucide-react";
import { EditorProps } from "../../../types";
import { useEffect } from "react"; // Добавлен useEffect

export const QuoteButton = ({ editor }: EditorProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editor) return;
      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.code === 'KeyB' 
      ) {
        event.preventDefault();
        event.stopPropagation();
        editor.chain().focus().toggleBlockquote().run();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true, passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [editor]);

  if (!editor) return null;

  const handleQuoteToggle = () => {
    editor.chain().focus().toggleBlockquote().run();
  };

  const isActive = editor.isActive("blockquote");

  return (
    <button
      type="button"
      onClick={handleQuoteToggle}
      className={`
        p-2 rounded duration-300 cursor-pointer
        ${isActive
          ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
          : "text-gray-700 hover:bg-gray-100"
        }
      `}
      title="Цитата (Ctrl+Shift+B)"
    >
      <Quote className="w-4 h-4" />
    </button>
  );
};