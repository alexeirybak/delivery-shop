import { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import {
  handleImageUpload,
  handleImageUrl,
  validateImageFile,
} from "../utils/upload-image";

interface UseImageUploadReturn {
  isUploading: boolean;
  uploadFile: (file: File, position?: number) => Promise<void>;
  insertByUrl: () => void;
  validateImageFile: (file: File) => string | null;
}

export const useImageUpload = (editor: Editor | null): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File, position?: number) => {
      if (!editor) return;

      setIsUploading(true);
      try {
        await handleImageUpload(file, editor, position); 
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
