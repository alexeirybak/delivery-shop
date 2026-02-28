import { useState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { LinkModalProps } from "../../../types";

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

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setOpenInNewTab(initialOpenInNewTab);

      setTimeout(() => {
        urlInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialUrl, initialText, initialOpenInNewTab]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 bg-black/50">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-xl"
      >
        <div className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            {isEditing ? "Редактировать ссылку" : "Добавить ссылку"}
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="link-text"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Текст ссылки
              </label>
              <input
                id="link-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Текст ссылки (опционально)"
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label
                htmlFor="link-url"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                URL адрес *
              </label>
              <input
                ref={urlInputRef}
                id="link-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
                required
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                <label
                  htmlFor="open-in-new-tab"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Открывать в новой вкладке
                </label>
              </div>
              <button
                type="button"
                onClick={() => setOpenInNewTab(!openInNewTab)}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full 
                   focus:outline-none focus:ring-2 
                  focus:ring-[#9674F9] focus:ring-offset-2 cursor-pointer transition-custom
                  ${openInNewTab ? "bg-[#9674F9]" : "bg-gray-300"}
                `}
                aria-pressed={openInNewTab}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white 
                    transition-transform duration-200
                    ${openInNewTab ? "translate-x-6" : "translate-x-1"}
                  `}
                />
              </button>
              <input
                type="checkbox"
                id="open-in-new-tab"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="sr-only"
              />
            </div>

            <div className="p-2 mt-2 text-xs text-gray-500 rounded bg-gray-50">
              {openInNewTab
                ? "Ссылка будет открываться в новой вкладке (рекомендуется для внешних ссылок)"
                : "Ссылка будет открываться в текущей вкладке (рекомендуется для навигации по Вашему сайту)"}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 transition-custom bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleAddLink}
              disabled={!url.trim()}
              className={`
                px-4 py-2 text-sm font-medium text-white rounded-md transition-custom
                ${
                  url.trim()
                    ? "bg-[#9674F9] hover:bg-[#8563e8] cursor-pointer"
                    : "bg-[#9674F9]/60 cursor-not-allowed"
                }
              `}
            >
              {isEditing ? "Обновить" : "Добавить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
