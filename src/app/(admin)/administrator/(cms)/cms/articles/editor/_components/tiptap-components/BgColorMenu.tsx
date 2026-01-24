import { Highlighter, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { EditorProps } from "../../../types";

const BG_COLORS = [
  "transparent", // Прозрачный
  "#FFFFFF", // Белый
  "#FFFFCC", // Светло-желтый
  "#CCFFFF", // Светло-голубой
  "#FFCCCC", // Светло-красный
  "#CCFFCC", // Светло-зеленый
  "#CCCCFF", // Светло-синий
  "#FFE5CC", // Светло-оранжевый
  "#E5CCFF", // Светло-фиолетовый
  "#FFCCE5", // Светло-розовый
  "#FFFF99", // Желтый
  "#99FFFF", // Голубой
  "#FF9999", // Красный
  "#99FF99", // Зеленый
  "#9999FF", // Синий
  "#FFCC99", // Оранжевый
  "#CC99FF", // Фиолетовый
];

export const BgColorMenu = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#FFFFFF");

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

  const getCurrentColor = useCallback(() => {
    if (!editor) return "transparent";
    const attrs = editor.getAttributes("textStyle");
    return attrs?.backgroundColor || "transparent";
  }, [editor]);

  useEffect(() => {
    if (editor) {
      const currentColor = getCurrentColor();
      if (currentColor !== "transparent" && !BG_COLORS.includes(currentColor)) {
        setCustomColor(currentColor);
      }
    }
  }, [editor, getCurrentColor]);

  const applyColor = (color: string) => {
    if (!editor) return;

    if (color === "transparent") {
      // Если выбрали прозрачный - сбрасываем цвет фона
      editor.chain().focus().unsetBackgroundColor().run();
    } else {
      // Иначе устанавливаем выбранный цвет фона
      editor.chain().focus().setBackgroundColor(color).run();
    }

    if (color !== "transparent" && !BG_COLORS.includes(color)) {
      setCustomColor(color);
    }
  };

  const resetColor = () => {
    if (!editor) return;
    // Используем unsetBackgroundColor как в документации
    editor.chain().focus().unsetBackgroundColor().run();
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
  };

  const applyCustomColor = () => {
    if (!editor) return;

    // Если выбрали прозрачный или белый, сбрасываем
    if (customColor === "transparent" || customColor === "#FFFFFF") {
      editor.chain().focus().unsetBackgroundColor().run();
    } else {
      editor.chain().focus().setBackgroundColor(customColor).run();
    }

    setIsOpen(false);
  };

  if (!editor) return null;

  const currentColor = getCurrentColor();
  const isActive = currentColor !== "transparent";

  return (
    <div className="relative inline-block">
      {/* Кнопка открытия меню */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`
          p-2 rounded duration-300 cursor-pointer border
          ${
            isOpen
              ? "bg-blue-100 text-[#9674F9] border-blue-300"
              : isActive
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200 border-blue-300"
                : "text-gray-700 hover:bg-gray-100 border-gray-300"
          }
        `}
        title="Цвет фона"
      >
        <div className="flex items-center gap-1">
          <Highlighter className="w-4 h-4" />
          <div
            className="w-3 h-3 rounded border border-gray-300"
            style={{
              backgroundColor:
                currentColor === "transparent" ? "#fff" : currentColor,
              backgroundImage:
                currentColor === "transparent"
                  ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                  : "none",
              backgroundSize:
                currentColor === "transparent" ? "8px 8px" : "auto",
            }}
          />
        </div>
      </button>

      {/* Выпадающее меню - уменьшенная версия */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 max-w-[calc(100vw-20px)]"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="mb-2">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Цвет фона
            </div>

            {/* Предопределенные цвета */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              {BG_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    applyColor(color);
                    setIsOpen(false);
                  }}
                  className={`
                    w-5 h-5 rounded border hover:scale-110 transition-transform relative duration-300 cursor-pointer
                    ${color === "transparent" ? "border-2" : "border border-gray-300"}
                  `}
                  style={{
                    backgroundColor: color === "transparent" ? "#fff" : color,
                    backgroundImage:
                      color === "transparent"
                        ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                        : "none",
                    backgroundSize:
                      color === "transparent" ? "8px 8px" : "auto",
                  }}
                  title={color === "transparent" ? "Прозрачный" : color}
                >
                  {currentColor === color && color !== "transparent" && (
                    <Check className="w-2.5 h-2.5 mx-auto text-gray-700 stroke-2 absolute inset-0 m-auto" />
                  )}
                  {color === "transparent" && currentColor === color && (
                    <Check className="w-2.5 h-2.5 mx-auto text-red-500 stroke-2 absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>

            {/* Пользовательский цвет */}
            <div className="mb-2">
              <div className="text-xs text-gray-600 mb-1">
                Свой цвет:
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="w-6 h-6 cursor-pointer rounded border border-gray-300"
                    title="Выберите цвет фона"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="flex-1 px-1.5 py-0.5 text-xs border border-gray-300 rounded"
                    placeholder="#FFFFFF"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyCustomColor}
                  className="w-full px-2 py-1 text-xs bg-[#9674F9] text-white rounded hover:bg-[#8563e8] duration-300 cursor-pointer"
                >
                  Применить цвет
                </button>
              </div>
            </div>

            {/* Текущий цвет */}
            <div className="flex items-center justify-between p-1 bg-gray-50 rounded text-xs mb-2">
              <div className="text-gray-600">Текущий:</div>
              <div className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{
                    backgroundColor:
                      currentColor === "transparent" ? "#fff" : currentColor,
                    backgroundImage:
                      currentColor === "transparent"
                        ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                        : "none",
                    backgroundSize:
                      currentColor === "transparent" ? "8px 8px" : "auto",
                  }}
                />
                <span className="font-mono truncate max-w-[100px]">
                  {currentColor === "transparent" ? "Прозрачный" : currentColor}
                </span>
              </div>
            </div>
          </div>

          {/* Кнопка сброса */}
          <button
            type="button"
            onClick={resetColor}
            className="w-full px-2 py-1 text-xs rounded duration-300 cursor-pointer bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300"
          >
            Сбросить цвет фона
          </button>
        </div>
      )}
    </div>
  );
};