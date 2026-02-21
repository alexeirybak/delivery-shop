import { useState, useEffect, useRef, useCallback } from "react";
import { X, Copy, Check, Save } from "lucide-react";
import Editor from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { HtmlEditorModalProps } from "../../../types";

export const HtmlEditorModal = ({
  editor,
  isOpen,
  onCloseAction,
}: HtmlEditorModalProps) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseAction();
      }
    };

    const handleSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleUpdate();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      window.addEventListener("keydown", handleSave);

      return () => {
        window.removeEventListener("keydown", handleEscape);
        window.removeEventListener("keydown", handleSave);
      };
    }
  }, [isOpen, onCloseAction, handleUpdate]);

  useEffect(() => {
    if (isOpen && editor) {
      const html = editor.getHTML();
      setHtmlContent(html);
    }
  }, [isOpen, editor]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Ошибка копирования:", err);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setHtmlContent(value || "");
  };

  const handleEditorDidMount = (
    editorInstance: monaco.editor.IStandaloneCodeEditor,
  ) => {
    editorRef.current = editorInstance;
    
    setTimeout(() => {
      editorInstance.focus();
      const model = editorInstance.getModel();
      if (model) {
        const lastLine = model.getLineCount();
        const lastColumn = model.getLineLength(lastLine) + 1;
        editorInstance.setSelection({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: lastLine,
          endColumn: lastColumn,
        });
      }
    }, 100);
  };

  const handleBeforeMount = (monacoInstance: typeof monaco) => {
    monacoInstance.editor.defineTheme("dark-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "tag", foreground: "569cd6" },
        { token: "attribute.name", foreground: "9cdcfe" },
        { token: "attribute.value", foreground: "ce9178" },
      ],
      colors: {
        "editor.background": "#111827",
        "editor.foreground": "#e5e7eb",
        "editor.lineHighlightBackground": "#1f2937",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#9ca3af",
        "editorCursor.foreground": "#ffffff",
        "editor.selectionBackground": "#374151",
        "editor.selectionHighlightBackground": "#1e3a8a",
        "editorIndentGuide.background": "#374151",
        "editorIndentGuide.activeBackground": "#4b5563",
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseAction();
      }}
    >
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl border border-gray-800 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">HTML редактор</h3>
            <p className="text-sm text-gray-400 mt-1">
              Редактирование с поддержкой инлайн-стилей и подсветкой синтаксиса
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

        <div className="overflow-hidden flex flex-col h-[calc(90vh-120px)]">
          <div className="grid grid-cols-2 flex-1 min-h-0">
            <div className="border-r border-gray-800 flex flex-col min-h-0">
              <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 shrink-0">
                <span className="text-sm font-medium text-gray-300">
                  Редактор HTML
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  language="html"
                  value={htmlContent}
                  theme="dark-theme"
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  loading={
                    <div className="text-white font-mono text-sm p-4 bg-gray-900 h-full flex items-center justify-center">
                      Загрузка редактора...
                    </div>
                  }
                  beforeMount={handleBeforeMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily:
                      "'Consolas', 'Monaco', 'Courier New', monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    autoClosingBrackets: "always",
                    autoClosingQuotes: "always",
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col min-h-0">
              <div className="border-l border-l-gray-700 px-4 py-3 bg-gray-800 border-b border-gray-700 shrink-0">
                <span className="text-sm font-medium text-gray-300">
                  Предпросмотр HTML
                </span>
              </div>
              <div
                className="flex-1 overflow-auto bg-white p-4"
                ref={previewRef}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      htmlContent ||
                      '<div class="text-gray-400 italic">Введите HTML для предпросмотра...</div>',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

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