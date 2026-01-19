"use client";

import { ImagePlus, Upload } from "lucide-react";
import { useRef, useCallback, ChangeEvent, useState } from "react";
import { EditorProps } from "../../../types";

export const ImageMenu = ({ editor }: EditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Загрузка на сервер (с привязкой к статье)
  const uploadToServer = async (file: File): Promise<{url: string, filename: string, originalName: string}> => {
    const formData = new FormData();
    formData.append("image", file);
    
    // Генерируем временный ID для статьи
    const tempArticleId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    formData.append("articleId", tempArticleId);
    formData.append("isTemp", "true");
    
    const response = await fetch("/administrator/cms/api/articles/upload/temp-image", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка загрузки: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Неизвестная ошибка');
    }
    
    return {
      url: data.url,
      filename: data.filename,
      originalName: data.originalName
    };
  };

  const insertImageSafe = useCallback((src: string, alt: string = "Изображение", filename?: string) => {
    if (!editor) return;

    const { from } = editor.state.selection;
    
    try {
      editor
        .chain()
        .focus()
        .insertContentAt(from, [
          {
            type: 'image',
            attrs: {
              src: src,
              alt: alt,
              title: filename || alt,
            }
          },
          { type: 'text', text: ' ' }
        ])
        .run();
    } catch (error) {
      console.error("Ошибка при вставке изображения:", error);
      const docSize = editor.state.doc.content.size;
      editor
        .chain()
        .setTextSelection(docSize)
        .focus()
        .insertContent([
          {
            type: 'image',
            attrs: {
              src: src,
              alt: alt,
              title: filename || alt,
            }
          },
          { type: 'text', text: ' ' }
        ])
        .run();
    }
  }, [editor]);

  const handleAddImageByUrl = () => {
    const url = window.prompt("Введите URL изображения:", "https://");
    
    if (url) {
      if (!url.match(/\.(jpeg|jpg|png|webp)(\?.*)?$/i)) {
        const confirm = window.confirm(
          "URL не указывает на изображение формата JPG, PNG или WebP.\n" +
          "Продолжить вставку? (Изображение может не загрузиться)"
        );
        if (!confirm) return;
      }
      const filename = url.split('/').pop() || "Изображение";
      insertImageSafe(url, filename, filename);
    }
  };

  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !files.length) return;

      const file = files[0];
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        alert(
          "Недопустимый формат файла.\n" +
          "Пожалуйста, выберите изображение в формате JPG, PNG или WebP."
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(
          "Файл слишком большой.\n" +
          "Максимальный размер: 5MB.\n" +
          `Ваш файл: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
        );
        return;
      }

      setIsUploading(true);

      try {
        // 1. Загружаем на сервер как временный файл
        const serverResult = await uploadToServer(file);
        
        // 2. Вставляем в редактор с СЕРВЕРНЫМ URL
        insertImageSafe(serverResult.url, serverResult.originalName, serverResult.filename);
        
      } catch (error) {
        alert("Ошибка при загрузке изображения. Пожалуйста, попробуйте снова.");
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [insertImageSafe]
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 mr-1">Изображения:</span>

      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 rounded duration-300 cursor-pointer flex items-center gap-1 ${
            isUploading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'hover:bg-gray-200 text-gray-600'
          }`}
          title={isUploading ? "Загрузка..." : "Загрузить изображение"}
          disabled={isUploading}
        >
          <Upload className={`w-4 h-4 ${isUploading ? 'animate-pulse' : ''}`} />
          {isUploading && <span className="text-xs">...</span>}
        </button>
      </div>

      <button
        type="button"
        onClick={handleAddImageByUrl}
        className="p-2 rounded hover:bg-gray-200 duration-300 cursor-pointer text-gray-600"
        title="Вставить по URL"
        disabled={isUploading}
      >
        <ImagePlus className="w-4 h-4" />
      </button>
    </div>
  );
};