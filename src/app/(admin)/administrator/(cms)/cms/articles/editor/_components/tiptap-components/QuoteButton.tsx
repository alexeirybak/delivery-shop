import { Quote } from "lucide-react";
import { EditorProps } from "../../../types";
import { useEffect, useState } from "react";

export const QuoteButton = ({ editor }: EditorProps) => {
  const [isActive, setIsActive] = useState(false);

  // Подписываемся на изменения редактора для определения активности
  useEffect(() => {
    if (!editor) return;

    const updateActiveState = () => {
      // Проверяем, активен ли блок цитаты
      const active = editor.isActive("blockquote");
      setIsActive(active);
    };

    // Подписываемся на события редактора
    editor.on("selectionUpdate", updateActiveState);
    editor.on("transaction", updateActiveState);

    // Инициализация
    updateActiveState();

    return () => {
      editor.off("selectionUpdate", updateActiveState);
      editor.off("transaction", updateActiveState);
    };
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editor) return;

      if (event.ctrlKey && event.shiftKey && event.code === "KeyB") {
        event.preventDefault();
        event.stopPropagation();
        editor.chain().focus().toggleBlockquote().run();
      }
    };

    window.addEventListener("keydown", handleKeyDown, {
      capture: true,
      passive: false,
    });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [editor]);

  if (!editor) return null;

  const handleQuoteToggle = () => {
    editor.chain().focus().toggleBlockquote().run();
  };

  return (
    <button
      type="button"
      onClick={handleQuoteToggle}
      className={`
        p-2 rounded transition-custom cursor-pointer
        ${
          isActive
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
