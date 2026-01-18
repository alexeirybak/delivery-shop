"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TiptapEditorProps } from "../../../types";
import { TableKit } from "@tiptap/extension-table";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { MainToolbar } from "./MainToolbar";
import { CharacterCount, Dropcursor, Placeholder } from "@tiptap/extensions";
import "../../css/editor.css";
import { Counter } from "./Counter";
import { Loader2 } from "lucide-react";
import { AllowHtmlAttributes } from "../AllowHtmlAttributes";

export const TiptapEditor = ({
  content,
  onContentChange,
}: TiptapEditorProps) => {
  const [stats, setStats] = useState({ characters: 0, words: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: { depth: 500, newGroupDelay: 100 },
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: "Начните писать статью здесь...",
      }),
      TextStyleKit.configure({
        fontSize: {
          types: ["heading", "paragraph", "textStyle"],
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
      AllowHtmlAttributes, 
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange(html);

      const characters = editor.storage.characterCount?.characters() || 0;
      const words = editor.storage.characterCount.words();

      setStats({ characters, words });
    },
  });

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-3">
        <div className="min-h-[200px] bg-gray-50 rounded p-3 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-3" />
          <div className="text-gray-500 text-sm">
            Инициализация редактора...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <MainToolbar editor={editor} />

      <div className="bg-white">
        <EditorContent
          editor={editor}
          className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        />
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
        <Counter wordCount={stats.words} charCount={stats.characters} />
      </div>
    </div>
  );
};