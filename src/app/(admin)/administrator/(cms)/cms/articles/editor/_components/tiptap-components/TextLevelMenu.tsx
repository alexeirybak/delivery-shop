import { HeadingButton } from "@/components/tiptap-ui/heading-button";
import { Type, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { EditorProps } from "../../../types";


export const TextLevelMenu = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentLabel = () => {
    if (editor?.isActive("paragraph")) return "Текст";
    for (let i = 1; i <= 6; i++) {
      if (editor?.isActive("heading", { level: i as 1 | 2 | 3 | 4 | 5 | 6 }))
        return `H${i}`;
    }
    return "Текст";
  };

  if (!editor) {
    return (
      <button
        disabled
        className="px-3 py-1.5 text-sm border rounded bg-gray-100"
      >
        Загрузка...
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      {/* Кнопка открытия меню */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 focus:outline-none duration-300 cursor-pointer"
      >
        <span className="font-medium">{getCurrentLabel()}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg min-w-40"
        >
          <div className="py-1">
            {/* Обычный текст */}
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setParagraph().run();
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                editor.isActive("paragraph") ? "bg-gray-200 text-gray-900" : ""
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Текст</span>
            </button>

            {/* Разделитель */}
            <div className="border-t border-gray-200 my-1"></div>

            {/* Заголовки */}
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <div key={level} className="px-1">
                <HeadingButton
                  level={level as 1 | 2 | 3 | 4 | 5 | 6}
                  editor={editor}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                    editor.isActive("heading", {
                      level: level as 1 | 2 | 3 | 4 | 5 | 6,
                    })
                      ? "bg-gray-200 text-gray-900"
                      : ""
                  }`}
                >
                  <span className="font-medium">H{level}</span>
                  <span className="text-gray-600 text-xs">
                    Заголовок {level}
                  </span>
                </HeadingButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
