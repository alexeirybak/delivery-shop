"use client";

import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { X } from "lucide-react";

interface HtmlEditorModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onCloseAction: () => void;
}

export const HtmlEditorModal = ({
  editor,
  isOpen,
  onCloseAction,
}: HtmlEditorModalProps) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (isOpen && editor) {
      setHtmlContent(editor.getHTML());
    }
  }, [isOpen, editor]);

  const handleApply = () => {
    if (editor) {
      editor.commands.setContent(htmlContent);
      onCloseAction();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-950 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Редактор HTML</h3>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600 duration-300 cursor-pointer"
          >
            <X />
          </button>
        </div>

        <div className="flex-1 p-4">
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="w-full h-full font-mono text-sm p-4 border rounded-lg"
            placeholder="Вставьте HTML код здесь..."
            spellCheck="false"
          />
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onCloseAction}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md duration-300 cursor-pointer"
          >
            Отмена
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md duration-300 cursor-pointer"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};
