import { Highlighter, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { EditorProps } from "../../../types";
import { BG_COLORS } from "../../../utils/bgColors";

export const BgColorMenu = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const [currentColor, setCurrentColor] = useState("transparent");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getCurrentColor = useCallback(() => {
    if (!editor) return "transparent";
    const attrs = editor.getAttributes("textStyle");
    return attrs?.backgroundColor || "transparent";
  }, [editor]);

  const updateColor = useCallback(() => {
    const color = getCurrentColor();
    setCurrentColor(color);

    if (color !== "transparent" && !BG_COLORS.includes(color)) {
      setCustomColor(color);
    }
  }, [getCurrentColor]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      updateColor();
    };

    editor.on("selectionUpdate", handleUpdate);
    editor.on("transaction", handleUpdate);

    updateColor();

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
    };
  }, [editor, updateColor]);

  useEffect(() => {
    if (isOpen && editor) {
      updateColor();
    }
  }, [isOpen, editor, updateColor]);

  useEffect(() => {
    if (editor) {
      const color = getCurrentColor();
      if (color !== "transparent" && !BG_COLORS.includes(color)) {
        setCustomColor(color);
      }
      setCurrentColor(color);
    }
  }, [editor, getCurrentColor]);

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

  const applyColor = (color: string) => {
    if (!editor) return;

    if (color === "transparent") {
      editor.chain().focus().unsetBackgroundColor().run();
    } else {
      editor.chain().focus().setBackgroundColor(color).run();
    }

    if (color !== "transparent" && !BG_COLORS.includes(color)) {
      setCustomColor(color);
    }

    setTimeout(updateColor, 10);
  };

  const resetColor = () => {
    if (!editor) return;
    editor.chain().focus().unsetBackgroundColor().run();
    setIsOpen(false);
    setTimeout(updateColor, 10);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
  };

  const applyCustomColor = () => {
    if (!editor) return;

    if (customColor === "transparent" || customColor === "#FFFFFF") {
      editor.chain().focus().unsetBackgroundColor().run();
    } else {
      editor.chain().focus().setBackgroundColor(customColor).run();
    }

    setIsOpen(false);
    setTimeout(updateColor, 10);
  };

  if (!editor) return null;

  const isActive = currentColor !== "transparent";

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`
          p-2 rounded transition-custom cursor-pointer border
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
            className="w-3 h-3 border border-gray-300 rounded"
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
          <div className="mb-2">
            <div className="mb-1 text-xs font-medium text-gray-700">
              Цвет фона
            </div>

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
                    w-5 h-5 rounded border hover:scale-110 transition-transform relative transition-custom cursor-pointer
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

            <div className="mb-2">
              <div className="mb-1 text-xs text-gray-600">Свой цвет:</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
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
                  className="w-full px-2 py-1 text-xs bg-[#9674F9] text-white rounded hover:bg-[#8563e8] transition-custom cursor-pointer"
                >
                  Применить цвет
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-1 mb-2 text-xs rounded bg-gray-50">
              <div className="text-gray-600">Текущий:</div>
              <div className="flex items-center gap-1">
                <div
                  className="w-4 h-4 border border-gray-300 rounded"
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

          <button
            type="button"
            onClick={resetColor}
            className="w-full px-2 py-1 text-xs text-red-700 border border-red-200 rounded cursor-pointer transition-custom bg-red-50 hover:bg-red-100 hover:border-red-300"
          >
            Сбросить цвет фона
          </button>
        </div>
      )}
    </div>
  );
};
