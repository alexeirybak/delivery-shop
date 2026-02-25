import { useState, useEffect, useRef } from "react";
import { Link as LinkIcon, Unlink, ExternalLink } from "lucide-react";
import { EditorProps } from "../../../types";

export const LinkMenu = ({ editor }: EditorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [isLinkActive, setIsLinkActive] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Подписываемся на изменения редактора для определения активности ссылки
  useEffect(() => {
    if (!editor) return;

    const updateLinkActive = () => {
      const active = editor.isActive("link");
      setIsLinkActive(active);
    };

    editor.on("selectionUpdate", updateLinkActive);
    editor.on("transaction", updateLinkActive);

    // Инициализация
    updateLinkActive();

    return () => {
      editor.off("selectionUpdate", updateLinkActive);
      editor.off("transaction", updateLinkActive);
    };
  }, [editor]);

  // Обработчик для предотвращения перехода по ссылкам в редакторе
  useEffect(() => {
    if (!editor) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A" && editor.view.dom.contains(target)) {
        event.preventDefault();
        event.stopPropagation();

        // Устанавливаем курсор на ссылку
        const pos = editor.view.posAtDOM(target, 0);
        if (pos >= 0) {
          editor.chain().focus().setTextSelection(pos).run();
        }
      }
    };

    const editorDom = editor.view.dom;
    editorDom.addEventListener("click", handleClick);

    return () => {
      editorDom.removeEventListener("click", handleClick);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    if (isModalOpen && editor.isActive("link")) {
      const attrs = editor.getAttributes("link");
      setUrl(attrs.href || "");
      setOpenInNewTab(attrs.target === "_blank");
      setText(
        editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
        ) || "",
      );
    } else if (isModalOpen) {
      setText(
        editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
        ) || "",
      );
      setUrl("");
      setOpenInNewTab(true);
    }
  }, [isModalOpen, editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => {
        urlInputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

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

    setIsModalOpen(false);
    setUrl("");
    setText("");
    setOpenInNewTab(true);
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUrl("");
    setText("");
    setOpenInNewTab(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && url.trim()) {
      handleAddLink();
    } else if (e.key === "Escape") {
      handleCloseModal();
    }
  };

  if (!editor) return null;

  const canRemoveLink = isLinkActive;

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Кнопка добавления/редактирования ссылки */}
        <button
          type="button"
          onClick={handleOpenModal}
          className={`
            p-2 rounded transition-custom cursor-pointer
            ${
              isLinkActive
                ? "bg-blue-100 text-[#9674F9] hover:bg-blue-200"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
          title="Добавить ссылку (Ctrl+K)"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Кнопка удаления ссылки */}
        <button
          type="button"
          onClick={handleRemoveLink}
          disabled={!canRemoveLink}
          className={`
            p-2 rounded transition-custom
            ${
              canRemoveLink
                ? "text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                : "opacity-40 cursor-not-allowed text-gray-400"
            }
          `}
          title="Удалить ссылку"
        >
          <Unlink className="w-4 h-4" />
        </button>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-300"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isLinkActive ? "Редактировать ссылку" : "Добавить ссылку"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="link-text"
                    className="block text-sm font-medium text-gray-700 mb-1"
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
                    className="block text-sm font-medium text-gray-700 mb-1"
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

                {/* Переключатель для target="_blank" */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 text-gray-500 mr-2" />
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
                      transition-colors focus:outline-none focus:ring-2 
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

                {/* Подсказка */}
                <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                  {openInNewTab
                    ? "Ссылка будет открываться в новой вкладке (рекомендуется для внешних ссылок)"
                    : "Ссылка будет открываться в текущей вкладке (рекомендуется для навигации по Вашему сайту)"}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-custom cursor-pointer"
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
                  {isLinkActive ? "Обновить" : "Добавить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
