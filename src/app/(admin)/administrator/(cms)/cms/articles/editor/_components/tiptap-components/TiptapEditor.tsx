"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import { Loader2 } from "lucide-react";
import { Counter } from "./Counter";
import { useState } from "react";
import { MainToolbar } from "./MainToolbar";
import { TiptapEditorProps } from "../../../types";
import "../../css/editor.css";
import { AllowHtmlAttributes } from "./AllowHtmlAttributes";

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
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            src: {
              default: null,
            },
            alt: {
              default: null,
            },
            title: {
              default: null,
            },
            width: {
              default: null,
              parseHTML: (element) => {
                // Получаем ширину из атрибута или стиля
                const widthAttr = element.getAttribute("width");
                if (widthAttr) return widthAttr.replace("px", "");

                const styleWidth = element.style.width;
                if (styleWidth) {
                  const match = styleWidth.match(/(\d+)px/);
                  return match ? match[1] : null;
                }

                return null;
              },
              renderHTML: (attributes) => {
                if (attributes.width) {
                  return {
                    width: attributes.width,
                    style: `width: ${attributes.width}px;`,
                  };
                }
                return {};
              },
            },
            height: {
              default: null,
              parseHTML: (element) => {
                // Получаем высоту из атрибута или стиля
                const heightAttr = element.getAttribute("height");
                if (heightAttr) return heightAttr.replace("px", "");

                const styleHeight = element.style.height;
                if (styleHeight) {
                  const match = styleHeight.match(/(\d+)px/);
                  return match ? match[1] : null;
                }

                return null;
              },
              renderHTML: (attributes) => {
                if (attributes.height) {
                  return {
                    height: attributes.height,
                    style: `height: ${attributes.height}px;`,
                  };
                }
                return {};
              },
            },
          };
        },

        renderHTML({ HTMLAttributes }) {
          const attrs = { ...HTMLAttributes };

          // Собираем стили
          const styles = ["max-width: 100%", "cursor: pointer"];

          if (attrs.width) {
            attrs.width = attrs.width.toString();
            styles.push(`width: ${attrs.width}px`);
          }

          if (attrs.height) {
            attrs.height = attrs.height.toString();
            styles.push(`height: ${attrs.height}px`);
          } else {
            styles.push("height: auto");
          }

          attrs.style = styles.join("; ");
          attrs.class = "tiptap-image";

          return ["img", attrs];
        },
      }).configure({
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
          alwaysPreserveAspectRatio: false, // Разрешаем менять пропорции
        },
        allowBase64: true,
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      onContentChange(html);

      const characters = editor.storage.characterCount.characters();
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
    <div className="border border-gray-300 rounded-lg">
      <MainToolbar editor={editor} />
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
