"use client";

import { Editor } from "@tiptap/react";
import { Palette, Highlighter, Trash2, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface ColorMenuProps {
  editor: Editor | null;
}

// Предопределенные цвета
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

export const ColorMenu = ({ editor }: ColorMenuProps) => {
  const [isTextColorOpen, setIsTextColorOpen] = useState(false);
  const [isBgColorOpen, setIsBgColorOpen] = useState(false);
  const [customTextColor, setCustomTextColor] = useState("#000000");
  const [customBgColor, setCustomBgColor] = useState("#FFFFFF");

  const textColorRef = useRef<HTMLDivElement>(null);
  const bgColorRef = useRef<HTMLDivElement>(null);
  const textButtonRef = useRef<HTMLButtonElement>(null);
  const bgButtonRef = useRef<HTMLButtonElement>(null);

  // Обработчик кликов вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textColorRef.current &&
        !textColorRef.current.contains(event.target as Node) &&
        textButtonRef.current &&
        !textButtonRef.current.contains(event.target as Node)
      ) {
        setIsTextColorOpen(false);
      }

      if (
        bgColorRef.current &&
        !bgColorRef.current.contains(event.target as Node) &&
        bgButtonRef.current &&
        !bgButtonRef.current.contains(event.target as Node)
      ) {
        setIsBgColorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Получаем текущие цвета через TextStyleKit
  const getCurrentTextColor = useCallback(() => {
    if (!editor) return "#000000";
    const attrs = editor.getAttributes("textStyle");
    return attrs?.color || "#000000";
  }, [editor]);

  const getCurrentBgColor = useCallback(() => {
    if (!editor) return "transparent";
    const attrs = editor.getAttributes("textStyle");
    return attrs?.backgroundColor || "transparent";
  }, [editor]);

  // Обновляем пользовательские цвета при изменении в редакторе
  useEffect(() => {
    if (editor) {
      const textColor = getCurrentTextColor();
      const bgColor = getCurrentBgColor();
      
      if (textColor !== "#000000" && !TEXT_COLORS.includes(textColor)) {
        setCustomTextColor(textColor);
      }
      
      if (bgColor !== "transparent" && !BG_COLORS.includes(bgColor)) {
        setCustomBgColor(bgColor);
      }
    }
  }, [editor, getCurrentBgColor, getCurrentTextColor]);

  // Применяем цвет текста
  const applyTextColor = (color: string) => {
    if (!editor) return;
    
    editor
      .chain()
      .focus()
      .setMark("textStyle", { color })
      .run();
    
    // Если пользовательский цвет, обновляем состояние
    if (!TEXT_COLORS.includes(color)) {
      setCustomTextColor(color);
    }
  };

  // Применяем цвет фона
  const applyBgColor = (color: string) => {
    if (!editor) return;
    
    editor
      .chain()
      .focus()
      .setMark("textStyle", { backgroundColor: color })
      .run();
    
    // Если пользовательский цвет, обновляем состояние
    if (color !== "transparent" && !BG_COLORS.includes(color)) {
      setCustomBgColor(color);
    }
  };

  // Сброс цвета текста
  const resetTextColor = () => {
    if (!editor) return;
    
    const currentAttributes = editor.getAttributes("textStyle");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { color, ...rest } = currentAttributes;
    
    if (Object.keys(rest).length === 0) {
      editor.chain().focus().unsetMark("textStyle").run();
    } else {
      editor.chain().focus().setMark("textStyle", rest).run();
    }
    
    setIsTextColorOpen(false);
  };

  // Сброс цвета фона
  const resetBgColor = () => {
    if (!editor) return;
    
    const currentAttributes = editor.getAttributes("textStyle");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { backgroundColor, ...rest } = currentAttributes;
    
    if (Object.keys(rest).length === 0) {
      editor.chain().focus().unsetMark("textStyle").run();
    } else {
      editor.chain().focus().setMark("textStyle", rest).run();
    }
    
    setIsBgColorOpen(false);
  };

  // Обработчик выбора пользовательского цвета текста
  const handleCustomTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomTextColor(color);
  };

  const applyCustomTextColor = () => {
    applyTextColor(customTextColor);
  };

  // Обработчик выбора пользовательского цвета фона
  const handleCustomBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomBgColor(color);
  };

  const applyCustomBgColor = () => {
    applyBgColor(customBgColor);
  };

  // Очистка пустых стилей
  const cleanEmptyStyles = () => {
    if (!editor) return;
    
    // Получаем все узлы с textStyle
    const { state, dispatch } = editor.view;
    const { tr } = state;
    let modified = false;

    state.doc.descendants((node, pos) => {
      if (node.type.name === "text") {
        node.marks.forEach((mark) => {
          if (mark.type.name === "textStyle") {
            const attrs = mark.attrs;
            // Проверяем, пустые ли атрибуты
            const isEmpty = Object.keys(attrs).every(key => {
              const value = attrs[key];
              return value === "" || 
                     value === null || 
                     value === undefined || 
                     (key === "color" && value === "#000000") ||
                     (key === "backgroundColor" && value === "transparent");
            });

            if (isEmpty) {
              tr.removeMark(pos, pos + node.nodeSize, mark.type);
              modified = true;
            }
          }
        });
      }
    });

    if (modified) {
      dispatch(tr);
      editor.chain().focus().run();
    }
  };

  if (!editor) {
    return (
      <div className="flex gap-1">
        <button disabled className="p-2 rounded border bg-gray-100">
          <Palette className="w-4 h-4" />
        </button>
        <button disabled className="p-2 rounded border bg-gray-100">
          <Highlighter className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const currentTextColor = getCurrentTextColor();
  const currentBgColor = getCurrentBgColor();

  return (
    <div className="flex items-center gap-1">
      {/* Цвет текста */}
      <div className="relative">
        <button
          ref={textButtonRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsTextColorOpen(!isTextColorOpen);
            setIsBgColorOpen(false);
          }}
          className={`p-2 rounded border flex items-center gap-1 hover:bg-gray-100 transition-colors ${
            currentTextColor !== "#000000"
              ? "bg-blue-50 border-blue-300"
              : "bg-white border-gray-300"
          }`}
          title="Цвет текста"
          aria-label="Цвет текста"
          type="button"
        >
          <Palette className="w-4 h-4" />
          <div
            className="w-3 h-3 rounded border border-gray-300"
            style={{ backgroundColor: currentTextColor }}
          />
        </button>

        {isTextColorOpen && (
          <div
            ref={textColorRef}
            className="absolute z-50 mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Цвет текста
              </div>
              
              {/* Предопределенные цвета */}
              <div className="grid grid-cols-8 gap-1 mb-3">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => applyTextColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                    type="button"
                  >
                    {currentTextColor === color && (
                      <Check className="w-3 h-3 mx-auto text-white stroke-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Пользовательский цвет */}
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">Пользовательский цвет:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customTextColor}
                    onChange={handleCustomTextColorChange}
                    className="w-8 h-8 cursor-pointer rounded border border-gray-300"
                    title="Выберите цвет"
                  />
                  <input
                    type="text"
                    value={customTextColor}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    placeholder="#000000"
                  />
                  <button
                    onClick={applyCustomTextColor}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    type="button"
                  >
                    Применить
                  </button>
                </div>
              </div>

              {/* Текущий цвет */}
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Текущий:</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border border-gray-300"
                    style={{ backgroundColor: currentTextColor }}
                  />
                  <span className="text-sm font-mono">{currentTextColor}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetTextColor}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
                type="button"
              >
                Сбросить
              </button>
              <button
                onClick={cleanEmptyStyles}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                type="button"
                title="Удалить пустые стили"
              >
                <Trash2 className="w-4 h-4" />
                Очистить
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Цвет фона */}
      <div className="relative">
        <button
          ref={bgButtonRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsBgColorOpen(!isBgColorOpen);
            setIsTextColorOpen(false);
          }}
          className={`p-2 rounded border flex items-center gap-1 hover:bg-gray-100 transition-colors ${
            currentBgColor !== "transparent"
              ? "bg-blue-50 border-blue-300"
              : "bg-white border-gray-300"
          }`}
          title="Цвет фона"
          aria-label="Цвет фона"
          type="button"
        >
          <Highlighter className="w-4 h-4" />
          <div
            className="w-3 h-3 rounded border border-gray-300"
            style={{
              backgroundColor: currentBgColor,
              backgroundImage: currentBgColor === "transparent" 
                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                : 'none',
              backgroundSize: currentBgColor === "transparent" ? '8px 8px' : 'auto',
            }}
          />
        </button>

        {isBgColorOpen && (
          <div
            ref={bgColorRef}
            className="absolute z-50 mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-2">
                Цвет фона
              </div>
              
              {/* Предопределенные цвета */}
              <div className="grid grid-cols-8 gap-1 mb-3">
                {BG_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => applyBgColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform relative"
                    style={{
                      backgroundColor: color === "transparent" ? "#fff" : color,
                      backgroundImage: color === "transparent" 
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : 'none',
                      backgroundSize: color === "transparent" ? '8px 8px' : 'auto',
                    }}
                    title={color === "transparent" ? "Прозрачный" : color}
                    type="button"
                  >
                    {currentBgColor === color && (
                      <Check className="w-3 h-3 mx-auto text-gray-700 stroke-2 absolute inset-0 m-auto" />
                    )}
                    {color === "transparent" && currentBgColor !== color && (
                      <div className="absolute inset-0 m-auto w-4 h-0.5 bg-red-500 transform rotate-45" />
                    )}
                  </button>
                ))}
              </div>

              {/* Пользовательский цвет */}
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">Пользовательский цвет:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={handleCustomBgColorChange}
                    className="w-8 h-8 cursor-pointer rounded border border-gray-300"
                    title="Выберите цвет фона"
                  />
                  <input
                    type="text"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    placeholder="#FFFFFF"
                  />
                  <button
                    onClick={applyCustomBgColor}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    type="button"
                  >
                    Применить
                  </button>
                </div>
              </div>

              {/* Текущий цвет */}
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Текущий:</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border border-gray-300"
                    style={{
                      backgroundColor: currentBgColor,
                      backgroundImage: currentBgColor === "transparent" 
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : 'none',
                      backgroundSize: currentBgColor === "transparent" ? '8px 8px' : 'auto',
                    }}
                  />
                  <span className="text-sm font-mono">
                    {currentBgColor === "transparent" ? "Прозрачный" : currentBgColor}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={resetBgColor}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
              type="button"
            >
              Сбросить цвет фона
            </button>
          </div>
        )}
      </div>
    </div>
  );
};