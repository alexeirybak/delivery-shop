import { Type } from "lucide-react";
import { useEffect } from "react";
import { EditorProps } from "../../types";
import "../../styles/paragraph-button.css";

export const ParagraphButton = ({ editor }: EditorProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        event.altKey &&
        (event.code === "Digit0" || event.code === "Numpad0") 
      ) {
        if (editor && editor.can().setParagraph()) {
          editor.chain().focus().setParagraph().run();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const isActive = editor.isActive("paragraph");

  return (
    <button
      onClick={() => editor.chain().focus().setParagraph().run()}
      className={`paragraph-button ${isActive ? "active" : ""}`}
      title="Обычный текст (Ctrl+Alt+0)"
      disabled={!editor.can().setParagraph()}
    >
      <Type />
    </button>
  );
};