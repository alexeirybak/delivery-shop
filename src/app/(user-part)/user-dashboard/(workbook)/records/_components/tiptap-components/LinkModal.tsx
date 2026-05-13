import { useState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { LinkModalProps } from "../../types";
import "../../styles/link-modal.css";

export const LinkModal = ({
  isOpen,
  onClose,
  editor,
  initialUrl = "",
  initialText = "",
  initialOpenInNewTab = true,
  isEditing = false,
}: LinkModalProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab);
  const modalRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isOpen && !isInitialMount.current) {
      const timer = setTimeout(() => {
        setUrl(initialUrl);
        setText(initialText);
        setOpenInNewTab(initialOpenInNewTab);
      }, 0);

      return () => clearTimeout(timer);
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [isOpen, initialUrl, initialText, initialOpenInNewTab]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        urlInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAddLink = () => {
    if (!editor || !url.trim()) return;

    const linkAttributes = {
      href: url,
      target: openInNewTab ? "_blank" : null,
      rel: openInNewTab ? "noopener noreferrer" : null,
    };

    if (editor.isActive("link")) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink(linkAttributes)
        .run();
    } else {
      if (text) {
        editor.chain().focus().setLink(linkAttributes).run();
      } else {
        editor.chain().focus().setLink(linkAttributes).insertContent(url).run();
      }
    }

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && url.trim()) {
      handleAddLink();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="link-modal-overlay">
      <div ref={modalRef} className="link-modal-content">
        <div className="link-modal-body">
          <h3 className="link-modal-title">
            {isEditing ? "Редактировать ссылку" : "Добавить ссылку"}
          </h3>

          <div className="link-modal-form">
            <div className="link-field">
              <label htmlFor="link-text" className="link-label">
                Текст ссылки
              </label>
              <input
                id="link-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="link-input"
                placeholder="Текст ссылки (опционально)"
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="link-field">
              <label htmlFor="link-url" className="link-label">
                URL адрес *
              </label>
              <input
                ref={urlInputRef}
                id="link-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="link-input"
                placeholder="https://example.com"
                required
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="link-new-tab">
              <label htmlFor="open-in-new-tab" className="link-new-tab-label">
                <ExternalLink />
                <span className="link-new-tab-text">
                  Открывать в новой вкладке
                </span>
              </label>
              <button
                type="button"
                onClick={() => setOpenInNewTab(!openInNewTab)}
                className={`link-switch ${openInNewTab ? "active" : ""}`}
                aria-pressed={openInNewTab}
              >
                <span className="link-switch-knob" />
              </button>
              <input
                type="checkbox"
                id="open-in-new-tab"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="sr-only"
              />
            </div>

            <div className="link-hint">
              {openInNewTab
                ? "Ссылка будет открываться в новой вкладке"
                : "Ссылка будет открываться в текущей вкладке"}
            </div>
          </div>

          <div className="link-modal-actions">
            <button type="button" onClick={onClose} className="link-cancel-btn">
              Отмена
            </button>
            <button
              type="button"
              onClick={handleAddLink}
              disabled={!url.trim()}
              className="link-submit-btn"
            >
              {isEditing ? "Обновить" : "Добавить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
