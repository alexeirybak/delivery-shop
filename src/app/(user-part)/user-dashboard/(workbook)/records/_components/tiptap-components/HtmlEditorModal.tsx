import { useState, useEffect, useRef, useCallback } from "react";
import { X, Save } from "lucide-react";
import Editor from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { HtmlEditorModalProps } from "../../types";
import "../../styles/html-editor-modal.css";
import { CopyButton } from "./CopyButton";

export const HtmlEditorModal = ({
  editor,
  isOpen,
  onCloseAction,
}: HtmlEditorModalProps) => {
  const [htmlContent, setHtmlContent] = useState("");
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
      const timer = setTimeout(() => {
        const html = editor.getHTML();
        setHtmlContent(html);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isOpen, editor]);

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
    monacoInstance.editor.defineTheme("custom-theme", {
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
      className="html-editor-overlay"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          target === e.currentTarget &&
          !target.closest(".html-editor-copy-btn")
        ) {
          onCloseAction();
        }
      }}
    >
      <div className="html-editor-modal">
        <div className="html-editor-header">
          <div className="html-editor-title-section">
            <h3>HTML редактор</h3>
            <p>
              Редактирование с поддержкой инлайн-стилей и подсветкой синтаксиса
            </p>
          </div>
          <div className="html-editor-actions">
            <div className="html-editor-char-count">
              {htmlContent.length} символов
            </div>
            <CopyButton htmlContent={htmlContent} />
            <button
              onClick={onCloseAction}
              className="html-editor-close"
              title="Закрыть (Esc)"
            >
              <X />
            </button>
          </div>
        </div>

        <div className="html-editor-content">
          <div className="html-editor-panels">
            <div className="html-editor-panel">
              <div className="html-editor-panel-header">
                <span>Редактор HTML</span>
              </div>
              <div className="html-editor-panel-content">
                <Editor
                  height="100%"
                  language="html"
                  value={htmlContent}
                  theme="custom-theme"
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

            <div className="html-editor-panel">
              <div className="html-editor-panel-header">
                <span>Предпросмотр HTML</span>
              </div>
              <div className="html-editor-preview" ref={previewRef}>
                <div
                  className="html-editor-preview-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      htmlContent ||
                      '<div class="html-editor-preview-empty">Введите HTML для предпросмотра...</div>',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="html-editor-footer">
          <div className="html-editor-shortcuts">
            <span>Горячие клавиши:</span>
            <kbd>Ctrl/Cmd + Enter</kbd>
            <span>- сохранить</span>
            <kbd>Esc</kbd>
            <span>- отмена</span>
          </div>
          <div className="html-editor-footer-actions">
            <button onClick={onCloseAction} className="html-editor-cancel">
              Отмена (Esc)
            </button>
            <button
              onClick={handleUpdate}
              disabled={!htmlContent.trim()}
              className={`html-editor-save ${htmlContent.trim() ? "active" : "disabled"}`}
            >
              <Save />
              Сохранить (Ctrl+Enter)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
