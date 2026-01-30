import { Palette, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { EditorProps } from "../../../types";

const TEXT_COLORS = [
  "#000000", // Черный
  "#FFFFFF", // Белый
  "#FF0000", // Красный
  "#00FF00", // Зеленый
  "#0000FF", // Синий
  "#FFFF00", // Желтый
  "#FF00FF", // Пурпурный
  "#00FFFF", // Голубой
  "#FFA500", // Оранжевый
  "#800080", // Фиолетовый
  "#008000", // Темно-зеленый
  "#000080", // Темно-синий
  "#800000", // Темно-красный
  "#808000", // Оливковый
  "#008080", // Бирюзовый
  "#808080", // Серый
  "#C0C0C0", // Светло-серый
];

export const TextColorMenu = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");
  const [currentColor, setCurrentColor] = useState("#000000"); // Добавлено состояние для текущего цвета

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Функция для получения текущего цвета текста
  const getCurrentColor = useCallback(() => {
    if (!editor) return "#000000";
    const attrs = editor.getAttributes("textStyle");
    return attrs?.color || "#000000";
  }, [editor]);

  // Функция для обновления состояния
  const updateColor = useCallback(() => {
    const color = getCurrentColor();
    setCurrentColor(color);
    
    // Если цвет не из предопределенных и не черный (по умолчанию), обновляем customColor
    if (color !== "#000000" && !TEXT_COLORS.includes(color)) {
      setCustomColor(color);
    }
  }, [getCurrentColor]);

  // Подписка на события редактора
  useEffect(() => {
    if (!editor) return;

    // Подписываемся на изменения редактора
    const handleUpdate = () => {
      updateColor();
    };

    editor.on("selectionUpdate", handleUpdate);
    editor.on("transaction", handleUpdate);

    // Инициализация при монтировании
    updateColor();

    // Отписываемся при размонтировании
    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
    };
  }, [editor, updateColor]);

  // Также обновляем при открытии меню
  useEffect(() => {
    if (isOpen && editor) {
      updateColor();
    }
  }, [isOpen, editor, updateColor]);

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

  useEffect(() => {
    if (editor) {
      const color = getCurrentColor();
      if (color !== "#000000" && !TEXT_COLORS.includes(color)) {
        setCustomColor(color);
      }
      setCurrentColor(color); // Инициализируем currentColor
    }
  }, [editor, getCurrentColor]);

  const applyColor = (color: string) => {
    if (!editor) return;

    if (color === "#000000") {
      // Если выбрали черный (по умолчанию) - сбрасываем цвет
      editor.chain().focus().unsetColor().run();
    } else {
      // Иначе устанавливаем выбранный цвет
      editor.chain().focus().setColor(color).run();
    }

    if (!TEXT_COLORS.includes(color)) {
      setCustomColor(color);
    }
    
    // Обновляем состояние после изменения
    setTimeout(updateColor, 10);
  };

  const resetColor = () => {
    if (!editor) return;
    // Используем unsetColor как в документации
    editor.chain().focus().unsetColor().run();
    setIsOpen(false);
    setTimeout(updateColor, 10);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
  };

  const applyCustomColor = () => {
    if (!editor) return;

    if (customColor === "#000000") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(customColor).run();
    }

    setIsOpen(false);
    setTimeout(updateColor, 10);
  };

  if (!editor) return null;

  const isActive = currentColor !== "#000000";

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
          p-2 rounded duration-300 border cursor-pointer
          ${
            isOpen
              ? "bg-blue-100 text-[#9674F9] border-blue-300"
              : isActive
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200 border-blue-300"
                : "text-gray-700 hover:bg-gray-100 border-gray-300"
          }
        `}
        title="Цвет текста"
      >
        <div className="flex items-center gap-1">
          <Palette className="w-4 h-4" />
          <div
            className="w-3 h-3 rounded border border-gray-300"
            style={{ backgroundColor: currentColor }}
          />
        </div>
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 max-w-[calc(100vw-20px)]"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="mb-2">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Цвет текста
            </div>

            <div className="grid grid-cols-6 gap-1 mb-2">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    applyColor(color);
                    setIsOpen(false);
                  }}
                  className={`
                    w-5 h-5 rounded border hover:scale-110 transition-transform relative duration-300 cursor-pointer
                    ${color === "#000000" ? "border-2" : "border border-gray-300"}
                  `}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {currentColor === color && (
                    <Check
                      className={`w-2.5 h-2.5 mx-auto stroke-2 absolute inset-0 m-auto ${
                        color === "#000000" ||
                        color === "#000080" ||
                        color === "#800000" ||
                        color === "#008000"
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mb-2">
              <div className="text-xs text-gray-600 mb-1">Свой цвет:</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="w-6 h-6 cursor-pointer rounded border border-gray-300"
                    title="Выберите цвет"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="flex-1 px-1.5 py-0.5 text-xs border border-gray-300 rounded"
                    placeholder="#000000"
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

            <div className="flex items-center justify-between p-1 bg-gray-50 rounded text-xs mb-2">
              <div className="text-gray-600">Текущий:</div>
              <div className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: currentColor }}
                />
                <span className="font-mono truncate max-w-[100px]">
                  {currentColor === "#000000" ? "По умолчанию" : currentColor}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={resetColor}
            className="w-full px-2 py-1 text-xs rounded duration-300 cursor-pointer bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300"
          >
            Сбросить цвет
          </button>
        </div>
      )}
    </div>
  );
};