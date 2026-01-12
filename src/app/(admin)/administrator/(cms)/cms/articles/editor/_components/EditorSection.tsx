"use client";

import { useEditor, EditorContent } from "@tiptap/react";


import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import {

  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface EditorSectionProps {
  _id?: string;
  content: string;
  onContentChangeAction: (content: string) => void;
}

const ResizableImage = Image.extend({
  name: "resizableImage",

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) => element.getAttribute("data-width") || "100%",
        renderHTML: (attributes) => {
          return {
            "data-width": attributes.width,
            style: `width: ${attributes.width};`,
          };
        },
      },
      height: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("data-height") || "auto",
        renderHTML: (attributes) => {
          return {
            "data-height": attributes.height,
            style:
              attributes.height !== "auto"
                ? `height: ${attributes.height};`
                : "",
          };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => {
          return {
            "data-align": attributes.align,
            class: `image-align-${attributes.align}`,
          };
        },
      },
      alt: {
        default: "",
        parseHTML: (element) => element.getAttribute("alt") || "",
        renderHTML: (attributes) => {
          return {
            alt: attributes.alt,
          };
        },
      },
    };
  },
});

export const EditorSection = ({
  content,
  onContentChangeAction,
}: EditorSectionProps) => {
  const [isMounted, setIsMounted] = useState(false);
  // Состояния для модальных окон
  // Данные для ссылок
  // Данные для изображений
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageWidth, setImageWidth] = useState("100%");
  const [imageAlign, setImageAlign] = useState<"left" | "center" | "right">(
    "center"
  );


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder: "Начните писать статью здесь...",
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-primary underline hover:text-primary/80",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      ResizableImage,
      BubbleMenu.configure({
        element: null,
        tippyOptions: {
          placement: "top",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();

      onContentChangeAction(html);
      setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length);
      setCharCount(text.length);
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[350px] p-4",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content && isMounted) {
      const text = editor.getText();
      setWordCount(text.split(/\s+/).filter((word) => word.length > 0).length);
      setCharCount(text.length);
    }
  }, [editor, content, isMounted]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);



  // Функции для работы с изображениями
  const insertImage = () => {
    if (imageUrl && editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: imageAlt,
          width: imageWidth,
          align: imageAlign,
        })
        .run();

      setImageUrl("");
      setImageAlt("");
      setImageWidth("100%");
      setImageAlign("center");
      setShowImageModal(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите файл изображения");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const openLinkModal = () => {
    if (editor?.isActive("link")) {
      // Если уже есть ссылка, редактируем её
      const linkAttrs = editor.getAttributes("link");
      setLinkUrl(linkAttrs.href || "");
      setLinkText(
        editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        )
      );
      setLinkTarget(linkAttrs.target || "_blank");
    } else {
      // Новая ссылка
      const selectedText = editor?.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );
      setLinkText(selectedText || "");
    }
    setShowLinkModal(true);
  };

  // Функция для рендеринга bubble menu для изображений
  const renderBubbleMenu = () => {
    if (!editor || !editor.isActive("resizableImage")) return null;

    const node = editor.state.selection.$from.node();
    const currentAlign = node?.attrs?.align || "center";
    const currentWidth = node?.attrs?.width || "100%";

    return (
      <div className="absolute top-0 left-0 transform -translate-y-full flex items-center bg-white border border-gray-300 rounded-lg shadow-lg p-2 space-x-1 z-50">
        {/* Изменение размера */}
        <button
          type="button"
          onClick={() => {
            const newWidth =
              currentWidth === "100%"
                ? "50%"
                : currentWidth === "50%"
                  ? "300px"
                  : "100%";
            editor
              .chain()
              .focus()
              .updateAttributes("resizableImage", { width: newWidth })
              .run();
          }}
          className={`p-2 rounded hover:bg-gray-100 ${currentWidth !== "100%" ? "bg-gray-100" : ""}`}
          title="Изменить размер"
        >
          {currentWidth === "100%" ? (
            <Maximize2 className="w-4 h-4" />
          ) : (
            <Minimize2 className="w-4 h-4" />
          )}
        </button>

        {/* Выравнивание */}
        <button
          type="button"
          onClick={() => {
            editor
              .chain()
              .focus()
              .updateAttributes("resizableImage", { align: "left" })
              .run();
          }}
          className={`p-2 rounded hover:bg-gray-100 ${currentAlign === "left" ? "bg-gray-200" : ""}`}
          title="Выровнять по левому краю"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            editor
              .chain()
              .focus()
              .updateAttributes("resizableImage", { align: "center" })
              .run();
          }}
          className={`p-2 rounded hover:bg-gray-100 ${currentAlign === "center" ? "bg-gray-200" : ""}`}
          title="Выровнять по центру"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            editor
              .chain()
              .focus()
              .updateAttributes("resizableImage", { align: "right" })
              .run();
          }}
          className={`p-2 rounded hover:bg-gray-100 ${currentAlign === "right" ? "bg-gray-200" : ""}`}
          title="Выровнять по правому краю"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Удаление */}
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().deleteSelection().run();
          }}
          className="p-2 rounded hover:bg-red-50 text-red-600"
          title="Удалить изображение"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Панель инструментов */}
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="flex flex-wrap items-center gap-1">


          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Ссылки и изображения */}
          <div className="flex items-center mr-2">
            <span className="text-xs text-gray-500 mr-2">Вставка:</span>
            <button
              type="button"
              onClick={openLinkModal}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("link") ? "bg-gray-300 text-primary" : "text-gray-600"}`}
              title={
                editor?.isActive("link") ? "Изменить ссылку" : "Вставить ссылку"
              }
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive("resizableImage") ? "bg-gray-300 text-primary" : "text-gray-600"}`}
              title="Вставить изображение"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1"></div>
          
          
        </div>
      </div>

      {/* Редактор с bubble menu */}
      <div className="relative">
        <EditorContent editor={editor} className="min-h-[400px] bg-white" />
        {renderBubbleMenu()}
      </div>


      {/* Статистика */}
      
    </div>
  );
};
