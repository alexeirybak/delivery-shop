import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { FONT_SIZES } from "../../utils/fontSizes";
import { EditorProps } from "../../types";
import "../../styles/font-size-menu.css";

const DEFAULT_SIZE = "16px";

export const FontSizeMenu = ({ editor }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displaySize, setDisplaySize] = useState("16");
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const extractFontSizeFromStyle = useCallback(
    (style: string): string | null => {
      const match = style.match(/font-size:\s*([^;]+)/i);
      return match ? match[1].trim() : null;
    },
    [],
  );

  const findFontSizeInSelection = useCallback(() => {
    if (!editor) return DEFAULT_SIZE;

    try {
      const { state, view } = editor;
      const { from } = state.selection;

      let foundSize = null;

      const textStyleAttrs = editor.getAttributes("textStyle");
      foundSize = textStyleAttrs?.fontSize;

      if (!foundSize) {
        const pos = Math.min(from, state.doc.content.size - 1);
        const domPos = view.domAtPos(pos);
        const node = domPos.node as HTMLElement;

        if (node) {
          let currentElement: HTMLElement | null =
            node.nodeType === 3 ? node.parentElement : node;

          while (currentElement && !foundSize) {
            const style = currentElement.getAttribute("style");
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
      }

      return foundSize || DEFAULT_SIZE;
    } catch (err) {
      setError("Ошибка при получении размера шрифта");
      console.error("Ошибка извлечения размера шрифта из DOM:", err);
      return DEFAULT_SIZE;
    }
  }, [editor, extractFontSizeFromStyle]);

  const updateSize = useCallback(() => {
    if (!editor) return;

    try {
      const size = findFontSizeInSelection();

      const finalSize = !size || size === "unset" ? DEFAULT_SIZE : size;

      const normalizedSize = finalSize.includes("px")
        ? finalSize
        : `${finalSize}px`;

      if (finalSize === "unset" || !finalSize) {
        setDisplaySize("16");
      } else {
        setDisplaySize(normalizedSize.replace("px", ""));
      }
      setError(null);
    } catch (err) {
      setError("Не удалось обновить размер шрифта");
      console.error("Ошибка обновления размера:", err);
    }
  }, [editor, findFontSizeInSelection]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      updateSize();
    };

    editor.on("selectionUpdate", handleUpdate);

    editor.on("transaction", ({ transaction }) => {
      if (transaction.selectionSet || transaction.docChanged) {
        requestAnimationFrame(() => {
          handleUpdate();
        });
      }
    });

    const timer = setTimeout(() => {
      updateSize();
    }, 0);

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
      clearTimeout(timer);
    };
  }, [editor, updateSize]);

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

    try {
      editor.chain().focus();

      if (size === "unset") {
        editor.chain().unsetFontSize().run();
      } else {
        editor.chain().setFontSize(size).run();
      }

      setIsOpen(false);
      setTimeout(() => {
        updateSize();
      }, 10);
      setError(null);
    } catch (err) {
      setError("Не удалось применить размер шрифта");
      console.error("Ошибка применения размера:", err);
    }
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  if (!editor) return null;

  const checkIsActive = (sizeValue: string) => {
    const currentSize = findFontSizeInSelection();

    if (sizeValue === "unset") {
      const normalizedCurrent = currentSize.includes("px")
        ? currentSize
        : `${currentSize}px`;
      return !currentSize || normalizedCurrent === DEFAULT_SIZE;
    }

    const normalizedCurrent = currentSize.includes("px")
      ? currentSize
      : `${currentSize}px`;
    const normalizedTarget = sizeValue.includes("px")
      ? sizeValue
      : `${sizeValue}px`;

    return normalizedCurrent === normalizedTarget;
  };

  return (
    <div className="font-size-menu">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        className={`font-size-trigger ${isOpen ? "open" : ""}`}
        title="Размер шрифта"
      >
        <span className="font-size-value">{displaySize}</span>
        <ChevronDown
          className={`font-size-chevron ${isOpen ? "rotated" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="font-size-dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-size-list">
            <div className="font-size-header">
              <span>РАЗМЕР ШРИФТА</span>
            </div>

            {FONT_SIZES.map((size) => {
              const isActive = checkIsActive(size.value);

              return (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => handleSizeChange(size.value)}
                  className={`font-size-item ${isActive ? "active" : ""}`}
                >
                  <div className="font-size-item-content">
                    <div
                      className={`font-size-indicator ${isActive ? "active" : ""}`}
                    />
                    <span
                      className={`font-size-label ${size.value === "unset" ? "italic" : ""}`}
                      style={
                        size.value !== "unset"
                          ? { fontSize: size.value }
                          : undefined
                      }
                    >
                      {size.label}
                    </span>
                  </div>
                  {isActive && <Check className="font-size-check" />}
                </button>
              );
            })}

            {error && (
              <div className="font-size-error">
                <div className="font-size-error-message">
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};