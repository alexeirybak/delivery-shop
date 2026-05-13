import { Editor } from "@tiptap/react";
import { HeadingButton } from "@/components/tiptap-ui/heading-button";
import { Type, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "../../styles/text-level-menu.css";

export const TextLevelMenu = ({ editor }: { editor: Editor | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [currentLabel, setCurrentLabel] = useState("Текст");

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      let newLabel = "Текст";

      for (let i = 1; i <= 6; i++) {
        if (editor.isActive("heading", { level: i as 1 | 2 | 3 | 4 | 5 | 6 })) {
          newLabel = `H${i}`;
          break;
        }
      }

      if (newLabel === "Текст" && editor.isActive("paragraph")) {
        newLabel = "Текст";
      }

      setCurrentLabel(newLabel);
    };

    editor.on("selectionUpdate", handleUpdate);

    editor.on("transaction", ({ transaction }) => {
      if (transaction.selectionSet || transaction.docChanged) {
        requestAnimationFrame(() => {
          handleUpdate();
        });
      }
    });

    handleUpdate();

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
    };
  }, [editor]);

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

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  if (!editor) {
    return null;
  }

  const isActiveHeading = (level: number) => {
    return editor.isActive("heading", {
      level: level as 1 | 2 | 3 | 4 | 5 | 6,
    });
  };

  const isActiveParagraph = editor.isActive("paragraph");

  return (
    <div className="text-level-menu">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        className={`text-level-trigger ${isOpen ? "open" : ""}`}
        title="Тип текста"
      >
        <span className="text-level-value">{currentLabel}</span>
        <ChevronDown
          className={`text-level-chevron ${isOpen ? "rotated" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="text-level-dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-level-list">
            <div className="text-level-header">
              <span>ТИП ТЕКСТА</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setParagraph().run();
                setIsOpen(false);
              }}
              className={`text-level-item ${isActiveParagraph ? "active" : ""}`}
            >
              <div className="text-level-item-content">
                <Type className="text-level-item-icon" />
                <span className="text-level-item-label">Текст</span>
              </div>
              {isActiveParagraph && <Check className="text-level-check" />}
            </button>

            <div className="text-level-divider"></div>

            {[1, 2, 3, 4, 5, 6].map((level) => {
              const isActive = isActiveHeading(level);

              return (
                <div key={level}>
                  <HeadingButton
                    level={level as 1 | 2 | 3 | 4 | 5 | 6}
                    editor={editor}
                    className={`text-level-item ${isActive ? "active" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="text-level-item-content">
                      <span className="text-level-item-label">H{level}</span>
                      <span className="text-level-item-desc">
                        Заголовок {level}
                      </span>
                    </div>
                    {isActive && <Check className="text-level-check" />}
                  </HeadingButton>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
