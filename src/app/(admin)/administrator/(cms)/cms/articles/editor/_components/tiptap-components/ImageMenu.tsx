"use client";

import { ImagePlus, Upload, Settings } from "lucide-react";
import { useRef, useCallback, ChangeEvent, useState, useEffect } from "react";
import { EditorProps } from "../../../types";
import { ImageAttributesDialog } from "./ImageAttributesDialog";

export const ImageMenu = ({ editor }: EditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAttributesDialogOpen, setIsAttributesDialogOpen] = useState(false);
  const [selectedImageAttrs, setSelectedImageAttrs] = useState<{
    alt: string;
    title: string;
  }>({ alt: "", title: "" });
  const [isImageSelected, setIsImageSelected] = useState(false);

  // Отслеживаем выделение изображения
  useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const { from, to } = editor.state.selection;

      // Проверяем, что выделение - это одиночная позиция (курсор)
      if (from === to) {
        // Ищем узел изображения в текущей позиции
        const node = editor.state.doc.nodeAt(from);
        setIsImageSelected(node?.type.name === "image");
      } else {
        // Если есть выделение диапазона, проверяем, содержит ли оно изображение
        let foundImage = false;
        editor.state.doc.nodesBetween(from, to, (node) => {
          if (node.type.name === "image") {
            foundImage = true;
            return false; // останавливаем поиск
          }
          return true;
        });
        setIsImageSelected(foundImage);
      }
    };

    // Подписываемся на изменения выделения
    editor.on("selectionUpdate", updateSelection);
    updateSelection(); // Инициализация

    return () => {
      editor.off("selectionUpdate", updateSelection);
    };
  }, [editor]);

  // Получаем атрибуты текущего выделенного изображения
  const getSelectedImageAttrs = () => {
    if (!editor) return { alt: "", title: "" };

    const { from, to } = editor.state.selection;
    let imageAttrs = { alt: "", title: "" };

    // Ищем изображение в выделенном диапазоне
    editor.state.doc.nodesBetween(from, to, (node) => {
      if (node.type.name === "image") {
        imageAttrs = {
          alt: node.attrs.alt || "",
          title: node.attrs.title || "",
        };
        return false; // останавливаем поиск после первого найденного изображения
      }
      return true;
    });

    return imageAttrs;
  };

  const updateImageAttributes = (attrs: { alt: string; title: string }) => {
    if (!editor) return;

    // Находим позицию изображения
    const { from, to } = editor.state.selection;
    let imagePos = -1;

    editor.state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === "image") {
        imagePos = pos;
        return false;
      }
      return true;
    });

    if (imagePos !== -1) {
      // Получаем текущие атрибуты изображения
      const imageNode = editor.state.doc.nodeAt(imagePos);
      if (!imageNode) return;

      // Создаем новый узел с обновленными атрибутами
      editor
        .chain()
        .command(({ tr, dispatch }) => {
          if (dispatch) {
            tr.setNodeMarkup(imagePos, undefined, {
              ...imageNode.attrs,
              ...attrs,
            });
            return true;
          }
          return false;
        })
        .run();
    }
  };

  const handleOpenAttributesDialog = () => {
    if (!editor || !isImageSelected) return;

    const attrs = getSelectedImageAttrs();
    setSelectedImageAttrs(attrs);
    setIsAttributesDialogOpen(true);
  };

  const uploadToServer = async (
    file: File,
  ): Promise<{ url: string; filename: string; originalName: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      "/administrator/cms/api/articles/upload/temp-image",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка загрузки: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Неизвестная ошибка");
    }

    return {
      url: data.url,
      filename: data.filename,
      originalName: data.originalName,
    };
  };

  const insertImageSafe = useCallback(
    (src: string, alt: string = "Изображение", filename?: string) => {
      if (!editor) return;

      const { from } = editor.state.selection;

      try {
        editor
          .chain()
          .focus()
          .insertContentAt(from, [
            {
              type: "image",
              attrs: {
                src: src,
                alt: alt,
                title: filename || alt,
              },
            },
            { type: "text", text: " " },
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
              type: "image",
              attrs: {
                src: src,
                alt: alt,
                title: filename || alt,
              },
            },
            { type: "text", text: " " },
          ])
          .run();
      }
    },
    [editor],
  );

  const handleAddImageByUrl = () => {
    const url = prompt("Введите URL изображения:", "https://");

    if (url) {
      if (!url.match(/\.(jpeg|jpg|png|webp)(\?.*)?$/i)) {
        alert(
          "Недопустимый формат файла. Разрешены только JPG, PNG и WebP изображения.",
        );
        return;
      }
      const filename = url.split("/").pop() || "Изображение";
      insertImageSafe(url, filename, filename);
    }
  };

  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !files.length) return;

      const file = files[0];

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        alert(
          "Недопустимый формат файла.\n" +
            "Пожалуйста, выберите изображение в формате JPG, PNG или WebP.",
        );
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(
          "Файл слишком большой.\n" +
            "Максимальный размер: 5MB.\n" +
            `Ваш файл: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        );
        return;
      }

      setIsUploading(true);

      try {
        const serverResult = await uploadToServer(file);
        insertImageSafe(
          serverResult.url,
          serverResult.originalName,
          serverResult.filename,
        );
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
    [insertImageSafe],
  );

  return (
    <>
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
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-200 text-gray-600"
            }`}
            title={isUploading ? "Загрузка..." : "Загрузить изображение"}
            disabled={isUploading}
          >
            <Upload
              className={`w-4 h-4 ${isUploading ? "animate-pulse" : ""}`}
            />
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

        {/* Кнопка редактирования атрибутов */}
        <button
          type="button"
          onClick={handleOpenAttributesDialog}
          className={`p-2 rounded duration-300 cursor-pointer flex items-center justify-center ${
            isImageSelected && !isUploading
              ? "hover:bg-gray-200 text-gray-600"
              : "text-gray-400 cursor-not-allowed opacity-50"
          }`}
          title={
            isImageSelected
              ? "Редактировать атрибуты изображения"
              : "Выделите изображение для редактирования атрибутов"
          }
          disabled={!isImageSelected || isUploading}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <ImageAttributesDialog
        isOpen={isAttributesDialogOpen}
        onClose={() => setIsAttributesDialogOpen(false)}
        onSave={updateImageAttributes}
        currentAlt={selectedImageAttrs.alt}
        currentTitle={selectedImageAttrs.title}
      />
    </>
  );
};
