import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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

export const FontSizeMenu = ({ editor }: EditorProps) => {
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

  if (!editor) return null;

  const currentSize = editor.getAttributes("textStyle").fontSize || "14px";
  const displaySize = currentSize === "unset" ? "Размер" : currentSize.replace("px", "");

  const handleSizeChange = (size: string) => {
    if (size === "unset") {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(size).run();
    }
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
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

            {/* Варианты размеров - ЯВНО указываем type="button" */}
            {FONT_SIZES.map((size) => {
              const isActive =
                size.value === "unset"
                  ? !editor.getAttributes("textStyle").fontSize
                  : currentSize === size.value;

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