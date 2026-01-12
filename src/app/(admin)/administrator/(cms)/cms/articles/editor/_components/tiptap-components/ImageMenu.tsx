"use client";

import { ImagePlus, Upload } from "lucide-react";
import { Editor } from "@tiptap/react";
import { useRef, useCallback, ChangeEvent } from "react";

interface ImageMenuProps {
  editor: Editor | null;
}

export const ImageMenu = ({ editor }: ImageMenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Универсальная функция вставки изображения
  const insertImageSafe = useCallback((src: string, alt: string = "Изображение") => {
    if (!editor) return;

    try {
      // 1. Сначала пытаемся просто вставить
      editor
        .chain()
        .focus()
        .setImage({
          src: src,
          alt: alt,
          title: alt,
        })
        .run();
    } catch {
      // 2. Если не получилось, вставляем в конец
      console.log("Попытка вставить в конец...");
      const docSize = editor.state.doc.content.size;
      
      editor
        .chain()
        .setTextSelection(docSize)
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: src,
            alt: alt,
            title: alt,
          }
        })
        .run();
    }
  }, [editor]);

  // Функция добавления изображения по URL
  const handleAddImageByUrl = () => {
    const url = window.prompt("Введите URL изображения:", "https://");
    
    if (url) {
      insertImageSafe(url, "Изображение");
    }
  };

  // Функция загрузки изображения из файла
  const handleFileUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !files.length) return;

      const file = files[0];
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение");
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64 && editor) {
          insertImageSafe(base64, file.name);
        }
      };

      reader.onerror = () => {
        alert("Ошибка при чтении файла");
      };

      reader.readAsDataURL(file);

      // Сброс input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [editor, insertImageSafe]
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-1">Изображения:</span>

      {/* Загрузка из файла */}
      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600"
          title="Загрузить изображение"
        >
          <Upload className="w-4 h-4" />
        </button>
      </div>

      {/* Добавление по URL */}
      <button
        type="button"
        onClick={handleAddImageByUrl}
        className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600"
        title="Вставить по URL"
      >
        <ImagePlus className="w-4 h-4" />
      </button>
    </div>
  );
};