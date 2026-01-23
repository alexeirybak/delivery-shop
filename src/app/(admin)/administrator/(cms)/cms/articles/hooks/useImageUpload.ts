import { useState, useCallback } from "react";
import {
  handleImageUpload,
  handleImageUrl,
  validateImageFile,
} from "../utils/upload-image";
import { UseImageUploadReturn } from "../types";
import { Editor } from "@tiptap/react";

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
      console.error("Editor is not available");
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
