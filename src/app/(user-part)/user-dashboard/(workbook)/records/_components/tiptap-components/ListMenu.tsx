import { List, ListOrdered } from "lucide-react";
import { useEffect, useState } from "react";
import { EditorProps } from "../../types";
import "../../styles/list-menu.css";

export const ListMenu = ({ editor }: EditorProps) => {
  const [isBulletListActive, setIsBulletListActive] = useState(false);
  const [isOrderedListActive, setIsOrderedListActive] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateActiveStates = () => {
      const bulletActive = editor.isActive("bulletList");
      setIsBulletListActive(bulletActive);

      const orderedActive = editor.isActive("orderedList");
      setIsOrderedListActive(orderedActive);
    };

    editor.on("selectionUpdate", updateActiveStates);
    editor.on("transaction", updateActiveStates);

    updateActiveStates();

    return () => {
      editor.off("selectionUpdate", updateActiveStates);
      editor.off("transaction", updateActiveStates);
    };
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editor) return;

      if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.code === "Digit8" || event.key === "8" || event.key === "*")
      ) {
        event.preventDefault();
        event.stopPropagation();
        editor.chain().focus().toggleBulletList().run();
      } else if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.code === "Digit9" || event.key === "9" || event.key === "(")
      ) {
        event.preventDefault();
        event.stopPropagation();
        editor.chain().focus().toggleOrderedList().run();
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

  const buttons = [
    {
      icon: <List />,
      title: "Маркированный список",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: isBulletListActive,
      shortcut: "Ctrl+Shift+8",
    },
    {
      icon: <ListOrdered />,
      title: "Нумерованный список",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: isOrderedListActive,
      shortcut: "Ctrl+Shift+9",
    },
  ];

  return (
    <div className="list-menu">
      {buttons.map((button, index) => (
        <button
          key={index}
          type="button"
          onClick={button.action}
          className={`list-button ${button.isActive ? "active" : ""}`}
          title={`${button.title} (${button.shortcut})`}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};
