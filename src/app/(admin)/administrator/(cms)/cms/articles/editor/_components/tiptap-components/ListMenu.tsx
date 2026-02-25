import { List, ListOrdered } from "lucide-react";
import { EditorProps } from "../../../types";
import { useEffect, useState } from "react";

export const ListMenu = ({ editor }: EditorProps) => {
  const [isBulletListActive, setIsBulletListActive] = useState(false);
  const [isOrderedListActive, setIsOrderedListActive] = useState(false);

  // Подписываемся на изменения редактора для определения активности списков
  useEffect(() => {
    if (!editor) return;

    const updateActiveStates = () => {
      // Проверяем активность маркированного списка
      const bulletActive = editor.isActive("bulletList");
      setIsBulletListActive(bulletActive);

      // Проверяем активность нумерованного списка
      const orderedActive = editor.isActive("orderedList");
      setIsOrderedListActive(orderedActive);
    };

    // Подписываемся на события редактора
    editor.on("selectionUpdate", updateActiveStates);
    editor.on("transaction", updateActiveStates);

    // Инициализация
    updateActiveStates();

    return () => {
      editor.off("selectionUpdate", updateActiveStates);
      editor.off("transaction", updateActiveStates);
    };
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editor) return;

      // Ctrl+Shift+8 для маркированного списка
      if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.code === "Digit8" || event.key === "8" || event.key === "*")
      ) {
        event.preventDefault();
        event.stopPropagation();
        editor.chain().focus().toggleBulletList().run();
      }

      // Ctrl+Shift+9 для нумерованного списка
      else if (
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
      icon: <List className="w-4 h-4" />,
      title: "Маркированный список",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: isBulletListActive,
      shortcut: "Ctrl+Shift+8",
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      title: "Нумерованный список",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: isOrderedListActive,
      shortcut: "Ctrl+Shift+9",
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {buttons.map((button, index) => (
        <button
          key={index}
          type="button"
          onClick={button.action}
          className={`
            p-2 rounded transition-custom cursor-pointer
            ${
              button.isActive
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
          title={`${button.title} (${button.shortcut})`}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};
