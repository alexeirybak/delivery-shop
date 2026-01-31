import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { EditorProps } from "../../../types";

const FONT_SIZES = [
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "Сбросить", value: "unset" },
];

const DEFAULT_SIZE = "16px";

export const FontSizeMenu = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displaySize, setDisplaySize] = useState("16");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Функция для извлечения размера шрифта из inline-стилей
  const extractFontSizeFromStyle = useCallback((style: string): string | null => {
    const match = style.match(/font-size:\s*([^;]+)/i);
    return match ? match[1].trim() : null;
  }, []);

  // Функция для поиска размера шрифта в текущем выделении
  const findFontSizeInSelection = useCallback(() => {
    if (!editor) return DEFAULT_SIZE;
    
    const { state, view } = editor;
    const { from } = state.selection; // Убрали неиспользуемую переменную 'to'
    
    let foundSize = null;
    
    // Сначала пробуем получить через атрибуты Tiпtаp
    const textStyleAttrs = editor.getAttributes("textStyle");
    foundSize = textStyleAttrs?.fontSize;
    
    // Если не нашли, ищем в DOM через inline-стили
    if (!foundSize) {
      try {
        // Получаем DOM-элемент для текущей позиции
        const pos = Math.min(from, state.doc.content.size - 1);
        const domPos = view.domAtPos(pos);
        const node = domPos.node as HTMLElement;
        
        if (node) {
          // Проверяем текущий элемент и его родители
          let currentElement: HTMLElement | null = node.nodeType === 3 ? node.parentElement : node;
          
          while (currentElement && !foundSize) {
            const style = currentElement.getAttribute('style');
            if (style) {
              const sizeFromStyle = extractFontSizeFromStyle(style);
              if (sizeFromStyle) {
                foundSize = sizeFromStyle;
                break;
              }
            }
            currentElement = currentElement.parentElement;
          }
        }
      } catch (error) {
        console.error("Error extracting font size from DOM:", error);
      }
    }
    
    return foundSize || DEFAULT_SIZE;
  }, [editor, extractFontSizeFromStyle]);

  // Функция для обновления состояния
  const updateSize = useCallback(() => {
    if (!editor) return;
    
    const size = findFontSizeInSelection();
    
    // Если размер не найден или пустой, используем 16px
    const finalSize = (!size || size === "unset") ? DEFAULT_SIZE : size;
    
    // Нормализуем размер (добавляем px если нет)
    const normalizedSize = finalSize.includes('px') ? finalSize : `${finalSize}px`;
    
    // Обновляем отображаемый размер
    if (finalSize === "unset" || !finalSize) {
      setDisplaySize("16");
    } else {
      setDisplaySize(normalizedSize.replace("px", ""));
    }
  }, [editor, findFontSizeInSelection]);

  // Подписка на события редактора
  useEffect(() => {
    if (!editor) return;

    // Подписываемся на изменения редактора
    const handleUpdate = () => {
      updateSize();
    };

    editor.on("selectionUpdate", handleUpdate);
    
    // Используем requestAnimationFrame для оптимизации
    editor.on("transaction", ({ transaction }) => {
      if (transaction.selectionSet || transaction.docChanged) {
        requestAnimationFrame(() => {
          handleUpdate();
        });
      }
    });

    // Инициализация при монтировании
    updateSize();

    // Отписываемся при размонтировании
    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
    };
  }, [editor, updateSize]);

  // Также обновляем при открытии меню
  useEffect(() => {
    if (isOpen && editor) {
      updateSize();
    }
  }, [isOpen, editor, updateSize]);

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

  const handleSizeChange = (size: string) => {
    if (!editor) return;
    
    // Сначала фокусируем редактор
    editor.chain().focus();
    
    if (size === "unset") {
      editor.chain().unsetFontSize().run();
    } else {
      editor.chain().setFontSize(size).run();
    }
    
    setIsOpen(false);
    // Обновляем состояние сразу
    updateSize();
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  if (!editor) return null;

  // Проверяем активность для пунктов меню
  const checkIsActive = (sizeValue: string) => {
    const currentSize = findFontSizeInSelection();
    
    if (sizeValue === "unset") {
      const normalizedCurrent = currentSize.includes('px') ? currentSize : `${currentSize}px`;
      return !currentSize || normalizedCurrent === DEFAULT_SIZE;
    }
    
    // Нормализуем оба размера для сравнения
    const normalizedCurrent = currentSize.includes('px') ? currentSize : `${currentSize}px`;
    const normalizedTarget = sizeValue.includes('px') ? sizeValue : `${sizeValue}px`;
    
    return normalizedCurrent === normalizedTarget;
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button" 
        onClick={handleButtonClick}
        className={`
          flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md duration-300 cursor-pointer
          ${isOpen
            ? "bg-blue-100 text-[#9674F9] border-blue-300"
            : "text-gray-700 hover:bg-gray-100 border-gray-300"
          }
        `}
        title="Размер шрифта"
      >
        <span className="text-xs font-mono">{displaySize}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 left-0 bg-white border border-gray-300 rounded-lg shadow-lg min-w-40"
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="py-1">
            {/* Заголовок меню */}
            <div className="px-3 py-2 border-b border-gray-100">
              <span className="text-xs font-medium text-gray-500">
                РАЗМЕР ШРИФТА
              </span>
            </div>

            {/* Варианты размеров */}
            {FONT_SIZES.map((size) => {
              const isActive = checkIsActive(size.value);

              return (
                <button
                  key={size.value}
                  type="button" 
                  onClick={() => {
                    handleSizeChange(size.value);
                  }}
                  className={`
                    w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 flex justify-between items-center duration-300 cursor-pointer
                    ${isActive
                      ? "bg-blue-50 text-[#9674F9] border-r-2 border-[#9674F9]"
                      : "text-gray-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {size.value !== "unset" && (
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ 
                          backgroundColor: isActive ? "#9674F9" : "transparent",
                          borderColor: isActive ? "#9674F9" : "#d1d5db"
                        }}
                      />
                    )}
                    <span 
                      className={size.value === "unset" ? "italic" : ""}
                      style={size.value !== "unset" ? { fontSize: size.value } : undefined}
                    >
                      {size.label}
                    </span>
                  </div>
                  {isActive && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};