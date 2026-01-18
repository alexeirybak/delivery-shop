import { FileCode } from "lucide-react";
import { useState, useEffect } from "react"; // Добавлен useEffect
import { EditorProps } from "../../../types";
import { HtmlEditorModal } from "./HtmlEditorModal";

export const CodeEditorButton = ({ editor }: EditorProps) => {
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Проверяем сочетание клавиш Ctrl+Shift+H
      if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.key.toLowerCase() === 'h' || event.key.toLowerCase() === 'р') // h в английской, р в русской раскладке
      ) {
        event.preventDefault(); // Предотвращаем стандартное поведение браузера
        setIsHtmlModalOpen(true);
      }
    };

    // Добавляем обработчик событий
    window.addEventListener('keydown', handleKeyDown);

    // Убираем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Пустой массив зависимостей - эффект выполняется один раз

  if (!editor) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsHtmlModalOpen(true)}
        className="p-2 rounded duration-300 cursor-pointer text-gray-700 hover:bg-gray-100"
        title="Редактор HTML (Ctrl+Shift+H)"
      >
        <FileCode className="w-4 h-4" />
      </button>

      <HtmlEditorModal
        editor={editor}
        isOpen={isHtmlModalOpen}
        onCloseAction={() => setIsHtmlModalOpen(false)}
      />
    </>
  );
};