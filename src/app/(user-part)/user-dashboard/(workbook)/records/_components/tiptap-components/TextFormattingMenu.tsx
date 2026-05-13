import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { useEffect, useState } from "react";
import { EditorProps } from "../../types";
import "../../styles/text-formatting-menu.css";

export const TextFormattingMenu = ({ editor }: EditorProps) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateStates = () => {
      setIsBold(editor.isActive("bold"));
      setIsItalic(editor.isActive("italic"));
      setIsUnderline(editor.isActive("underline"));
      setIsStrike(editor.isActive("strike"));
    };

    editor.on("selectionUpdate", updateStates);
    editor.on("transaction", updateStates);

    updateStates();

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
    <div className="text-formatting-menu">
      <button
        type="button"
        onClick={handleBold}
        disabled={!canBold}
        className={`format-button ${isBold ? "active" : ""}`}
        title={`Жирный (Ctrl+B)${!canBold ? " - недоступно" : ""}`}
      >
        <Bold />
      </button>

      <button
        type="button"
        onClick={handleItalic}
        disabled={!canItalic}
        className={`format-button ${isItalic ? "active" : ""}`}
        title={`Курсив (Ctrl+I)${!canItalic ? " - недоступно" : ""}`}
      >
        <Italic />
      </button>

      <button
        type="button"
        onClick={handleUnderline}
        disabled={!canUnderline}
        className={`format-button ${isUnderline ? "active" : ""}`}
        title={`Подчеркнутый (Ctrl+U)${!canUnderline ? " - недоступно" : ""}`}
      >
        <Underline />
      </button>

      <button
        type="button"
        onClick={handleStrike}
        disabled={!canStrike}
        className={`format-button ${isStrike ? "active" : ""}`}
        title={`Зачеркнутый (Ctrl+Shift+S)${!canStrike ? " - недоступно" : ""}`}
      >
        <Strikethrough />
      </button>
    </div>
  );
};
