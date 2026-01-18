import { Type } from "lucide-react";
import { useEffect } from "react"; // Добавлен useEffect
import { EditorProps } from "../../../types";

export const ParagraphButton = ({ editor }: EditorProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Проверяем сочетание клавиш Ctrl+Alt+0
      if (
        event.ctrlKey &&
        event.altKey &&
        (event.key === '0' || event.key === ')') // 0 на основной клавиатуре или на цифровом блоке
      ) {
        event.preventDefault();
        if (editor && editor.can().setParagraph()) {
          editor.chain().focus().setParagraph().run();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const isActive = editor.isActive("paragraph");

  return (
    <button
      onClick={() => editor.chain().focus().setParagraph().run()}
      className={`p-2 rounded duration-300 cursor-pointer ${
        isActive
          ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      title="Обычный текст (Ctrl+Alt+0)"
      disabled={!editor.can().setParagraph()}
    >
      <Type className="w-4 h-4" />
    </button>
  );
};