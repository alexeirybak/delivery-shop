"use client";

import { useState, useEffect, useRef } from "react";
import { X, Copy, Check } from "lucide-react";
import { Editor } from "@tiptap/react";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markup"; // Для HTML
import "prismjs/themes/prism-tomorrow.css"; // Темная тема

interface HtmlEditorModalProps {
  editor: Editor;
  isOpen: boolean;
  onCloseAction: () => void;
}

export const HtmlEditorModal = ({
  editor,
  isOpen,
  onCloseAction,
}: HtmlEditorModalProps) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (isOpen && editor) {
      const html = editor.getHTML();
      setHtmlContent(html);
      
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, editor]);

  const handleUpdate = () => {
    if (editor && htmlContent.trim()) {
      editor.chain().focus().setContent(htmlContent).run();
      onCloseAction();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCloseAction();
    }
    if (e.ctrlKey && e.key === "Enter") {
      handleUpdate();
    }
  };

  const formatHtml = (html: string): string => {
    let formatted = html
      .replace(/></g, ">\n<")
      .replace(/\n\s*\n/g, "\n")
      .trim();
    
    let indent = 0;
    formatted = formatted
      .split("\n")
      .map(line => {
        line = line.trim();
        if (line.startsWith("</")) {
          indent = Math.max(0, indent - 1);
        }
        const indentedLine = "  ".repeat(indent) + line;
        if (line.startsWith("<") && !line.startsWith("</") && !line.endsWith("/>")) {
          indent++;
        }
        return indentedLine;
      })
      .join("\n");
    
    return formatted;
  };

  const highlightedHtml = htmlContent ? highlight(
    formatHtml(htmlContent),
    languages.markup,
    'html'
  ) : '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-800 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Редактор HTML</h3>
            <p className="text-sm text-gray-400 mt-1">
              Просмотр и редактирование исходного кода
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm cursor-pointer ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              title="Копировать HTML"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Скопировано
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Копировать
                </>
              )}
            </button>
            <button
              onClick={onCloseAction}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg cursor-pointer"
              title="Закрыть (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[500px]">
          {/* Левая часть - редактирование */}
          <div className="w-1/2 border-r border-gray-800 flex flex-col">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 h-10">
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
                Редактирование
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="flex-1 w-full bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none outline-none border-none"
              spellCheck="false"
              placeholder="Введите HTML код..."
            />
          </div>

          {/* Правая часть - предпросмотр с подсветкой */}
          <div className="w-1/2 flex flex-col">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 h-10">
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
                Предпросмотр с подсветкой{" "} 
              </span>
              <span className="text-xs text-gray-400">HTML</span>
            </div>
            <div className="flex-1 overflow-auto bg-gray-900 p-4">
              <pre
                ref={preRef}
                className="text-sm font-mono text-gray-100 leading-relaxed overflow-auto"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            </div>
          </div>
        </div>

        {/* Подвал с кнопками */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span className="font-medium">Подсказка:</span> Используйте Ctrl+Enter для сохранения, Esc для отмены
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCloseAction}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer"
            >
              Отмена
            </button>
            <button
              onClick={handleUpdate}
              disabled={!htmlContent.trim()}
              className={`px-4 py-2 text-sm font-medium rounded-lg duration-300 cursor-pointer ${
                htmlContent.trim()
                  ? "bg-[#9674F9] text-white hover:bg-[#8563e8]"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              Применить изменения
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};