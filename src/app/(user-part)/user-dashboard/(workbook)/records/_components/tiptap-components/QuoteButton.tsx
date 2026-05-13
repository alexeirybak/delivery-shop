import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { EditorProps } from "../../types";
import "../../styles/quote-button.css";

export const QuoteButton = ({ editor }: EditorProps) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateActiveState = () => {
      const active = editor.isActive("blockquote");
      setIsActive(active);
    };

    editor.on("selectionUpdate", updateActiveState);
    editor.on("transaction", updateActiveState);

    updateActiveState();

    return () => {
      editor.off("selectionUpdate", updateActiveState);
      editor.off("transaction", updateActiveState);
    };
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editor) return;

      if (event.ctrlKey && event.shiftKey && event.code === "KeyB") {
        event.preventDefault();
        event.stopPropagation();
        editor.chain().focus().toggleBlockquote().run();
      }
    };

    window.addEventListener("keydown", handleKeyDown, {
      capture: true,
      passive: false,
    });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [editor]);

  if (!editor) return null;

  const handleQuoteToggle = () => {
    editor.chain().focus().toggleBlockquote().run();
  };

  return (
    <button
      type="button"
      onClick={handleQuoteToggle}
      className={`quote-button ${isActive ? "active" : ""}`}
      title="Цитата (Ctrl+Shift+B)"
    >
      <Quote />
    </button>
  );
};