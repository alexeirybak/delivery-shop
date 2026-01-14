"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Unlink } from "lucide-react";
import { EditorProps } from "../../../types";

export const LinkMenu = ({ editor }: EditorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (!editor) return;

    if (isModalOpen && editor.isActive("link")) {
      const attrs = editor.getAttributes("link");
      setUrl(attrs.href || "");
      setText(
        editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        ) || ""
      );
    } else if (isModalOpen) {
      setText(
        editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        ) || ""
      );
      setUrl("");
    }
  }, [isModalOpen, editor]);

  const handleAddLink = () => {
    if (!editor || !url.trim()) return;

    if (editor.isActive("link")) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } else {
      if (text) {
        editor.chain().focus().setLink({ href: url }).run();
      } else {
        editor.chain().focus().setLink({ href: url }).insertContent(url).run();
      }
    }

    setIsModalOpen(false);
    setUrl("");
    setText("");
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
  };

  if (!editor) return null;

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleOpenModal}
          className={`p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer ${
            editor.isActive("link")
              ? "bg-gray-300 text-green-600"
              : "text-gray-600"
          }`}
          title="Добавить ссылку (Ctrl+K)"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleRemoveLink}
          disabled={!editor.isActive("link")}
          className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          title="Удалить ссылку"
        >
          <Unlink className="w-4 h-4" />
        </button>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editor.isActive("link")
                  ? "Редактировать ссылку"
                  : "Добавить ссылку"}
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
                    placeholder="Текст ссылки"
                  />
                </div>

                <div>
                  <label
                    htmlFor="link-url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    URL *
                  </label>
                  <input
                    id="link-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md duration-300 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!url.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md duration-300 cursor-pointer disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {editor.isActive("link") ? "Обновить" : "Добавить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
