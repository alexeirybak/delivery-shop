import { useState, useCallback } from "react";
import {
  handleImageUpload,
  handleImageUrl,
  validateImageFile,
} from "../utils/upload-image";
import { Editor } from "@tiptap/react";

interface UseImageUploadReturn {
  isUploading: boolean;
  uploadFile: (file: File) => Promise<void>;
  insertByUrl: () => void;
  validateImageFile: (file: File) => string | null;
}

export const useImageUpload = (editor: Editor | null): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!editor) return;

      setIsUploading(true);
      try {
        await handleImageUpload(file, editor);
      } finally {
        setIsUploading(false);
      }
    },
    [editor],
  );

  const insertByUrl = useCallback(() => {
    if (!editor) {
      console.error("Редактор не доступен");
      return;
    }
    handleImageUrl(editor);
  }, [editor]);

  return {
    isUploading,
    uploadFile,
    insertByUrl,
    validateImageFile,
  };
};