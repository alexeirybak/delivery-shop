"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Copy, Check, Save } from "lucide-react";
import { Editor } from "@tiptap/react";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";

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
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleUpdate = useCallback(() => {
    if (!editor || !htmlContent.trim()) return;
    editor
      .chain()
      .focus()
      .setContent(htmlContent, {
        parseOptions: {
          preserveWhitespace: "full",
        },
      })
      .run();

    onCloseAction();
  }, [editor, htmlContent, onCloseAction]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseAction();
      }
    },
    [onCloseAction],
  );

  // Обработчик Ctrl+Enter
  const handleSave = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleUpdate();
      }
    },
    [handleUpdate],
  );

  // Глобальные обработчики клавиш
  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      window.addEventListener("keydown", handleSave);

      return () => {
        window.removeEventListener("keydown", handleEscape);
        window.removeEventListener("keydown", handleSave);
      };
    }
  }, [isOpen, handleEscape, handleSave]);

  // Фокус на textarea при открытии
  useEffect(() => {
    if (isOpen && editor) {
      const html = editor.getHTML();
      setHtmlContent(html);

      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }, 100);
    }
  }, [isOpen, editor]);

  // Синхронизация прокрутки
  useEffect(() => {
    const textarea = textareaRef.current;
    const pre = preRef.current;

    if (!textarea || !pre) return;

    const handleScroll = () => {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Ошибка копирования:", err);
    }
  };

  // Локальный обработчик клавиш для textarea
  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Escape") {
      onCloseAction();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleUpdate();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlContent(e.target.value);
  };

  const getHighlightedHtml = () => {
    if (!htmlContent) return "";

    try {
      return highlight(htmlContent, languages.markup, "html");
    } catch (error) {
      console.error("Ошибка подсветки:", error);
      return htmlContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  };

  if (!isOpen) return null;

  const highlightedHtml = getHighlightedHtml();

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseAction();
      }}
    >
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl border border-gray-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Заголовок */}
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">HTML редактор</h3>
            <p className="text-sm text-gray-400 mt-1">
              Редактирование с поддержкой инлайн-стилей
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {htmlContent.length} символов
            </div>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm duration-300 cursor-pointer ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
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
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg duration-300 cursor-pointer"
              title="Закрыть (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 overflow-hidden grid grid-cols-2">
          {/* Левая часть - редактирование с подсветкой */}
          <div className="border-r border-gray-800 flex flex-col relative">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <span className="text-sm font-medium text-gray-300">
                Редактор HTML
              </span>
              <span className="text-xs text-gray-400 ml-2">
                (Ctrl+Enter сохранить, Esc отмена)
              </span>
            </div>
            
            {/* Контейнер для синхронизированной прокрутки */}
            <div className="flex-1 overflow-auto relative">
              {/* Подсветка синтаксиса (фон) */}
              <pre
                ref={preRef}
                className="absolute inset-0 m-0 p-4 font-mono text-sm text-gray-100 leading-relaxed pointer-events-none overflow-hidden"
                style={{
                  fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
              
              {/* Textarea для ввода */}
              <textarea
                ref={textareaRef}
                value={htmlContent}
                onChange={handleTextareaChange}
                onKeyDown={handleTextareaKeyDown}
                className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white font-mono text-sm p-4 resize-none outline-none"
                spellCheck="false"
                placeholder="Введите HTML код..."
                style={{
                  fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              />
            </div>
          </div>

          {/* Правая часть - предпросмотр */}
          <div className="flex flex-col">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <span className="text-sm font-medium text-gray-300">
                Предпросмотр HTML
              </span>
            </div>
            <div className="flex-1 overflow-auto bg-gray-900 p-4">
              <div
                className="text-sm leading-relaxed m-0 prose prose-invert max-w-none bg-white p-2"
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  lineHeight: "1.6",
                }}
                dangerouslySetInnerHTML={{ 
                  __html: htmlContent || '<span class="text-gray-500">Введите HTML для предпросмотра...</span>' 
                }}
              />
            </div>
          </div>
        </div>

        {/* Подвал */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <div>
                  <span className="font-medium">Горячие клавиши:</span>
                  <kbd className="ml-2 px-2 py-1 bg-gray-800 rounded text-xs">
                    Ctrl/Cmd + Enter
                  </kbd>{" "}
                  - сохранить
                  <kbd className="ml-2 px-2 py-1 bg-gray-800 rounded text-xs">
                    Esc
                  </kbd>{" "}
                  - отмена
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onCloseAction}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg duration-300 cursor-pointer"
              >
                Отмена (Esc)
              </button>
              <button
                onClick={handleUpdate}
                disabled={!htmlContent.trim()}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 duration-300 cursor-pointer ${
                  htmlContent.trim()
                    ? "bg-[#9674F9] text-white hover:bg-[#8563e8]"
                    : "bg-gray-800 text-gray-400 cursor-not-allowed"
                }`}
                title="Ctrl+Enter"
              >
                <Save className="w-4 h-4" />
                Сохранить (Ctrl+Enter)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};