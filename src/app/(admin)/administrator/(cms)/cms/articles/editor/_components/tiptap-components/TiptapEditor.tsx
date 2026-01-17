"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TiptapEditorProps } from "../../../types";
import { TableKit } from "@tiptap/extension-table";
import {
  LineHeight,
  TextStyle,
  TextStyleKit,
} from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { MainToolbar } from "./MainToolbar";
import {
  UndoRedo,
  CharacterCount,
  Dropcursor,
  Placeholder,
} from "@tiptap/extensions"; // CharacterCount уже здесь!
import "../../css/editor.css";
import { Counter } from "./Counter";

export const TiptapEditor = ({
  content,
  onContentChange,
}: TiptapEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({ characters: 0, words: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Отключаем стандартный History из StarterKit
        undoRedo: false,
      }),
      UndoRedo.configure({
        depth: 500,
        newGroupDelay: 100,
      }),
      // ДОБАВЬТЕ CharacterCount СЮДА
      CharacterCount,
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
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange(html);

      // Обновляем статистику сразу при обновлении
      const characters = editor.storage.characterCount?.characters() || 0;
      const words = editor.storage.characterCount.words();

      setStats({ characters, words });
    },
  });

  // Инициализация монтирования
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Не рендерить ничего до монтирования на клиенте
  if (!isMounted || !editor) {
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
      <MainToolbar editor={editor} />

      <div className="relative bg-white">
        <EditorContent
          editor={editor}
          className="min-h-[400px] p-4 focus:outline-none"
        />
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
        {/* Используем stats вместо прямого обращения к storage */}
        <Counter wordCount={stats.words} charCount={stats.characters} />
      </div>
    </div>
  );
};
