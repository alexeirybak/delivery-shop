"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TiptapEditorProps } from "../../../types";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import { LineHeight, TextStyle, TextStyleKit } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { Counter } from "./Counter";
import { MainToolbar } from "./MainToolbar";
import { Dropcursor, CharacterCount } from "@tiptap/extensions";
import "../../css/editor.css";

export const TiptapEditor = ({
  content,
  onContentChangeAction,
}: TiptapEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Начните писать статью здесь...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle, 
      LineHeight, 
      TextStyleKit.configure({
        backgroundColor: false,
        fontSize: {
          types: ["heading", "paragraph"],
        },
      }),
      TableKit,
      CharacterCount,
      Image.configure({
        resize: {
          enabled: true,
          directions: [
            "top",
            "bottom",
            "left",
            "right",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: false,
        },
        allowBase64: true,
        HTMLAttributes: {
          class: "tiptap-image",
          style: "max-width: 100%; height: auto; cursor: pointer;",
        },
      }),
      Dropcursor.configure({
        width: 2,
        class: "dropcursor",
        color: "#000000",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChangeAction(html);
    },
    immediatelyRender: false,
  });

  // Инициализация монтирования
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Синхронизация внешнего контента
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Получаем статистику из редактора
  const characters = editor?.storage.characterCount?.characters() || 0;
  const words = editor?.storage.characterCount?.words() || 0;

  // Не рендерить ничего до монтирования на клиенте
  if (!isMounted) {
    return (
      <div className="border border-gray-300 rounded-lg p-3">
        <div className="min-h-[200px] bg-gray-50 rounded p-3 flex items-center justify-center">
          <div className="text-gray-500">Инициализация редактора...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Главная панель инструментов */}
      <MainToolbar editor={editor} />

      {/* Область редактора */}
      <div className="relative bg-white">
        <EditorContent
          editor={editor}
          className="min-h-[400px] p-4 focus:outline-none"
        />
      </div>

      {/* Счетчик */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
        <Counter wordCount={words} charCount={characters} />
      </div>
    </div>
  );
};
