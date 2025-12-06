import { useState, useRef } from "react";
import { Editor } from "@tiptap/react";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File, editor: Editor) => {
    if (!editor) return;

    setUploading(true);

    try {
      const objectUrl = URL.createObjectURL(file);

      editor
        .chain()
        .focus()
        .setImage({
          src: objectUrl,
          alt: file.name || "Изображение",
          title: file.name || "",
        })
        .run();

      try {
        const uploadedUrl = await uploadToServer(file);
        if (uploadedUrl && uploadedUrl !== objectUrl) {
          replaceImageUrl(objectUrl, uploadedUrl, editor);
        }
      } catch (uploadError) {
        console.warn(
          "Ошибка загрузки на сервер, оставляем локальную версию:",
          uploadError
        );
      }
    } catch (error) {
      console.error("Ошибка при обработке изображения:", error);
    } finally {
      setUploading(false);
    }
  };

  const uploadToServer = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("Сервер не вернул URL изображения");
      }

      return data.url;
    } catch (error) {
      console.error("Ошибка при загрузке на сервер:", error);
      return URL.createObjectURL(file);
    }
  };

  const replaceImageUrl = (oldUrl: string, newUrl: string, editor: Editor) => {
    if (!editor) return;

    const state = editor.state;
    const tr = state.tr;

    state.doc.descendants((node, pos) => {
      if (node.type.name === "image" && node.attrs.src === oldUrl) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          src: newUrl,
        });
      }
    });

    if (tr.docChanged) {
      editor.view.dispatch(tr);
    }
  };

  return {
    uploading,
    fileInputRef,
    handleImageUpload,
  };
}