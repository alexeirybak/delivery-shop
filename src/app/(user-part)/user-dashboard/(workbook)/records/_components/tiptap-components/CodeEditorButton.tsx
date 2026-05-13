import { FileCode } from "lucide-react";
import { useState, useEffect } from "react";
import { HtmlEditorModal } from "./HtmlEditorModal";
import { EditorProps } from "../../types";
import "../../styles/code-editor-button.css";

export const CodeEditorButton = ({ editor }: EditorProps) => {
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.code === "KeyH") {
        event.preventDefault();
        setIsHtmlModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!editor) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsHtmlModalOpen(true)}
        className="code-editor-button"
        title="Редактор HTML (Ctrl+Shift+H)"
      >
        <FileCode />
      </button>

      <HtmlEditorModal
        editor={editor}
        isOpen={isHtmlModalOpen}
        onCloseAction={() => setIsHtmlModalOpen(false)}
      />
    </>
  );
};
