import { Palette, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { TEXT_COLORS } from "../../utils/textColor";
import { EditorProps } from "../../types";
import "../../styles/text-color-menu.css";

export const TextColorMenu = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState("var(--color-text)");
  const [currentColor, setCurrentColor] = useState("var(--color-text)");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getCurrentColor = useCallback(() => {
    if (!editor) return "var(--color-text)";
    const attrs = editor.getAttributes("textStyle");
    return attrs?.color || "var(--color-text)";
  }, [editor]);

  const updateColor = useCallback(() => {
    const color = getCurrentColor();
    setCurrentColor(color);

    if (color !== "var(--color-text)" && !TEXT_COLORS.includes(color)) {
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

    const timer = setTimeout(() => {
      updateColor();
    }, 0);

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
      clearTimeout(timer);
    };
  }, [editor, updateColor]);

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

    if (color === "var(--color-text)") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }

    if (!TEXT_COLORS.includes(color)) {
      setCustomColor(color);
    }

    setTimeout(updateColor, 10);
  };

  const resetColor = () => {
    if (!editor) return;
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

    if (customColor === "var(--color-text)" || customColor === "#000000" || customColor === "#ffffff") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(customColor).run();
    }

    setIsOpen(false);
    setTimeout(updateColor, 10);
  };

  if (!editor) return null;

  const isActive = currentColor !== "var(--color-text)";

  const getCheckColorClass = (color: string) => {
    const darkColors = ["#000000", "#000080", "#800000", "#008000", "#1a1a1a"];
    return darkColors.includes(color.toLowerCase()) ? "light" : "dark";
  };

  const displayColor = currentColor === "var(--color-text)" 
    ? getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() 
    : currentColor;

  return (
    <div className="text-color-menu">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-color-trigger ${isOpen ? "open" : ""} ${isActive ? "active" : ""}`}
        title="Цвет текста"
      >
        <div className="text-color-trigger-content">
          <Palette />
          <div
            className="text-color-indicator"
            style={{ backgroundColor: displayColor }}
          />
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="text-color-dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-color-section">
            <div className="text-color-title">Цвет текста</div>

            <div className="text-color-grid">
              <button
                key="default"
                type="button"
                onClick={() => {
                  applyColor("var(--color-text)");
                  setIsOpen(false);
                }}
                className="text-color-option default"
                style={{ 
                  backgroundColor: "var(--color-text)",
                  border: "1px solid var(--color-line)"
                }}
                title="По умолчанию"
              >
                {currentColor === "var(--color-text)" && (
                  <Check className="text-color-check light" />
                )}
              </button>
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    applyColor(color);
                    setIsOpen(false);
                  }}
                  className="text-color-option"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {currentColor === color && (
                    <Check className={`text-color-check ${getCheckColorClass(color)}`} />
                  )}
                </button>
              ))}
            </div>

            <div className="text-color-custom-section">
              <div className="text-color-custom-label">Свой цвет:</div>
              <div className="text-color-custom-controls">
                <div className="text-color-custom-row">
                  <input
                    type="color"
                    value={customColor === "var(--color-text)" ? "#000000" : customColor}
                    onChange={handleCustomColorChange}
                    className="text-color-picker"
                    title="Выберите цвет"
                  />
                  <input
                    type="text"
                    value={customColor === "var(--color-text)" ? "" : customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="text-color-hex-input"
                    placeholder="По умолчанию"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyCustomColor}
                  className="text-color-apply-btn"
                >
                  Применить цвет
                </button>
              </div>
            </div>

            <div className="text-color-current">
              <div className="text-color-current-label">Текущий:</div>
              <div className="text-color-current-value">
                <div
                  className="text-color-current-swatch"
                  style={{ backgroundColor: displayColor }}
                />
                <span className="text-color-current-text">
                  {currentColor === "var(--color-text)" ? "По умолчанию" : currentColor}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={resetColor}
            className="text-color-reset"
          >
            Сбросить цвет
          </button>
        </div>
      )}
    </div>
  );
};