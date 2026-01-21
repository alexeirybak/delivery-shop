// TiptapEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import { Loader2 } from "lucide-react";
import { Counter } from "./Counter";
import { useState } from "react";
import { MainToolbar } from "./MainToolbar";
import { TiptapEditorProps } from "../../../types";
import "../../css/editor.css";
import { AllowHtmlAttributes } from "./AllowHtmlAttributes";
import FileHandler from "@tiptap/extension-file-handler";
import { CustomImage } from "../../../utils/custom-image";
import { handleImageUpload } from "../../../utils/upload-image";

export const TiptapEditor = ({
  content,
  onContentChange,
}: TiptapEditorProps) => {
  const [stats, setStats] = useState({ characters: 0, words: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: {
          depth: 500,
          newGroupDelay: 100,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyleKit.configure({
        fontSize: {
          types: ["heading", "paragraph", "textStyle"],
        },
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: "Начните писать статью здесь …",
      }),
      AllowHtmlAttributes,
      TableKit,
      CustomImage,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ],

        onDrop: async (currentEditor, files, pos) => {
          // Обработка drag&drop файлов
          if (!currentEditor) return;

          for (const file of files) {
            await handleImageUpload(file, currentEditor, pos);
          }
        },

        onPaste: (currentEditor, files, htmlContent) => {
          if (!currentEditor) return;

          // Если копируем из браузера (содержит HTML)
          if (htmlContent && htmlContent.includes("<img")) {
            // Даем возможность другим расширениям обработать
            return false;
          }

          if (files.length > 0) {
            files.forEach(async (file) => {
              await handleImageUpload(
                file,
                currentEditor,
                currentEditor.state.selection.anchor,
              );
            });
            return true; 
          }

          return false; 
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      onContentChange(html);

      const characters = currentEditor.storage.characterCount.characters();
      const words = currentEditor.storage.characterCount.words();

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
    <div className="border border-gray-300 rounded-lg">
      <MainToolbar editor={editor}/>
      <div className="bg-white">
        <EditorContent
          editor={editor}
          className="min-h-[400px] p-4 focus:outline-none"
        />
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
        <Counter wordCount={stats.words} charCount={stats.characters} />
      </div>
    </div>
  );
};
