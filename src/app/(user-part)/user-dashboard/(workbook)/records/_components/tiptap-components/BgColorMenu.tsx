import { Highlighter, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { BG_COLORS } from "../../utils/bgColors";
import { EditorProps } from "../../types";
import "../../styles/bg-color-menu.css";

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
    if (!editor) return;

    const timer = setTimeout(() => {
      const color = getCurrentColor();
      if (color !== "transparent" && !BG_COLORS.includes(color)) {
        setCustomColor(color);
      }
      setCurrentColor(color);
    }, 0);

    return () => clearTimeout(timer);
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
    <div className="bg-color-menu">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-color-trigger ${isOpen ? "open" : ""} ${isActive ? "active" : ""}`}
        title="Цвет фона"
      >
        <div className="bg-color-trigger-content">
          <Highlighter />
          <div
            className={`bg-color-indicator ${currentColor === "transparent" ? "transparent" : ""}`}
            style={{
              backgroundColor:
                currentColor === "transparent" ? "#fff" : currentColor,
            }}
          />
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="bg-color-dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-color-section">
            <div className="bg-color-title">Цвет фона</div>

            <div className="bg-color-grid">
              {BG_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    applyColor(color);
                    setIsOpen(false);
                  }}
                  className={`bg-color-option ${color === "transparent" ? "transparent" : ""}`}
                  style={{
                    backgroundColor: color === "transparent" ? "#fff" : color,
                  }}
                  title={color === "transparent" ? "Прозрачный" : color}
                >
                  {currentColor === color && color !== "transparent" && (
                    <Check className="bg-color-check light" />
                  )}
                  {color === "transparent" && currentColor === color && (
                    <Check className="bg-color-check dark" />
                  )}
                </button>
              ))}
            </div>

            <div className="bg-color-custom-section">
              <div className="bg-color-custom-label">Свой цвет:</div>
              <div className="bg-color-custom-controls">
                <div className="bg-color-custom-row">
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="bg-color-picker"
                    title="Выберите цвет фона"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="bg-color-hex-input"
                    placeholder="#FFFFFF"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyCustomColor}
                  className="bg-color-apply-btn"
                >
                  Применить цвет
                </button>
              </div>
            </div>

            <div className="bg-color-current">
              <div className="bg-color-current-label">Текущий:</div>
              <div className="bg-color-current-value">
                <div
                  className="bg-color-current-swatch"
                  style={{
                    backgroundColor:
                      currentColor === "transparent" ? "#fff" : currentColor,
                  }}
                />
                <span className="bg-color-current-text">
                  {currentColor === "transparent" ? "Прозрачный" : currentColor}
                </span>
              </div>
            </div>
          </div>

          <button type="button" onClick={resetColor} className="bg-color-reset">
            Сбросить цвет фона
          </button>
        </div>
      )}
    </div>
  );
};
