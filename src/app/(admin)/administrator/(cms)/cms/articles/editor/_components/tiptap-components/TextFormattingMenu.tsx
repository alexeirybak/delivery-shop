import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { EditorProps } from "../../../types";
import { useEffect, useState } from "react";

export const TextFormattingMenu = ({ editor }: EditorProps) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);

  // Хук useEffect должен вызываться безусловно
  useEffect(() => {
    if (!editor) return;

    // Обновляем состояния при изменении редактора
    const updateStates = () => {
      setIsBold(editor.isActive("bold"));
      setIsItalic(editor.isActive("italic"));
      setIsUnderline(editor.isActive("underline"));
      setIsStrike(editor.isActive("strike"));
    };

    // Подписываемся на события редактора
    editor.on("selectionUpdate", updateStates);
    editor.on("transaction", updateStates);

    // Инициализация
    updateStates();

    // Обработчик горячих клавиш
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.code === "KeyS") {
        event.preventDefault();
        if (editor.can().chain().focus().toggleStrike().run()) {
          editor.chain().focus().toggleStrike().run();
          updateStates();
        }
      }

      if (event.ctrlKey && event.code === "KeyB") {
        event.preventDefault();
        if (editor.can().chain().focus().toggleBold().run()) {
          editor.chain().focus().toggleBold().run();
          updateStates();
        }
      }

      if (event.ctrlKey && event.code === "KeyI") {
        event.preventDefault();
        if (editor.can().chain().focus().toggleItalic().run()) {
          editor.chain().focus().toggleItalic().run();
          updateStates();
        }
      }

      if (event.ctrlKey && event.code === "KeyU") {
        event.preventDefault();
        if (editor.can().chain().focus().toggleUnderline().run()) {
          editor.chain().focus().toggleUnderline().run();
          updateStates();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      editor.off("selectionUpdate", updateStates);
      editor.off("transaction", updateStates);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  if (!editor) return null;

  const handleBold = () => {
    editor.chain().focus().toggleBold().run();
    setIsBold(editor.isActive("bold"));
  };

  const handleItalic = () => {
    editor.chain().focus().toggleItalic().run();
    setIsItalic(editor.isActive("italic"));
  };

  const handleUnderline = () => {
    editor.chain().focus().toggleUnderline().run();
    setIsUnderline(editor.isActive("underline"));
  };

  const handleStrike = () => {
    editor.chain().focus().toggleStrike().run();
    setIsStrike(editor.isActive("strike"));
  };

  const canBold = editor.can().chain().focus().toggleBold().run();
  const canItalic = editor.can().chain().focus().toggleItalic().run();
  const canUnderline = editor.can().chain().focus().toggleUnderline().run();
  const canStrike = editor.can().chain().focus().toggleStrike().run();

  return (
    <div className="flex items-center gap-1">
      {/* Bold */}
      <button
        type="button"
        onClick={handleBold}
        disabled={!canBold}
        className={`
          p-2 rounded transition-custom 
          ${
            !canBold
              ? "opacity-40 cursor-not-allowed text-gray-400"
              : isBold
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200 cursor-pointer"
                : "text-gray-700 hover:bg-gray-100 cursor-pointer"
          }
        `}
        title={`Жирный (Ctrl+B)${!canBold ? " - недоступно" : ""}`}
      >
        <Bold className="w-4 h-4" />
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={handleItalic}
        disabled={!canItalic}
        className={`
          p-2 rounded transition-custom 
          ${
            !canItalic
              ? "opacity-40 cursor-not-allowed text-gray-400"
              : isItalic
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200 cursor-pointer"
                : "text-gray-700 hover:bg-gray-100 cursor-pointer"
          }
        `}
        title={`Курсив (Ctrl+I)${!canItalic ? " - недоступно" : ""}`}
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={handleUnderline}
        disabled={!canUnderline}
        className={`
          p-2 rounded transition-custom 
          ${
            !canUnderline
              ? "opacity-40 cursor-not-allowed text-gray-400"
              : isUnderline
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200 cursor-pointer"
                : "text-gray-700 hover:bg-gray-100 cursor-pointer"
          }
        `}
        title={`Подчеркнутый (Ctrl+U)${!canUnderline ? " - недоступно" : ""}`}
      >
        <Underline className="w-4 h-4" />
      </button>

      {/* Strike */}
      <button
        type="button"
        onClick={handleStrike}
        disabled={!canStrike}
        className={`
          p-2 rounded transition-custom 
          ${
            !canStrike
              ? "opacity-40 cursor-not-allowed text-gray-400"
              : isStrike
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200 cursor-pointer"
                : "text-gray-700 hover:bg-gray-100 cursor-pointer"
          }
        `}
        title={`Зачеркнутый (Ctrl+Shift+S)${!canStrike ? " - недоступно" : ""}`}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
    </div>
  );
};
