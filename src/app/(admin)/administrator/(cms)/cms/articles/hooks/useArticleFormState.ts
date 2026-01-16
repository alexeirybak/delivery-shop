"use client";

import { useCallback, useState } from "react";
import { transliterate } from "../../../../../../../../utils/transliterate";
import { useArticleStore } from "@/store/articleStore";

export const useArticleFormState = () => {
  const { formData, updateFormField, resetFormData, setOriginalImageUrl } =
    useArticleStore();
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);

  const generateSlug = useCallback(() => {
    if (!formData.name.trim()) {
      alert("Сначала введите название статьи");
      return;
    }

    const slug = transliterate(formData.name, true);
    updateFormField("slug", slug);
  }, [formData.name, updateFormField]);

  const saveImageFile = useCallback(
    (file: File) => {
      setTempImageFile(file);
      const tempUrl = URL.createObjectURL(file);
      updateFormField("image", tempUrl);

      if (formData.name) {
        updateFormField("imageAlt", `${formData.name}`);
      }
    },
    [formData.name, updateFormField]
  );

  const removeImage = useCallback(() => {
    if (formData.image && formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }

    setTempImageFile(null);
    updateFormField("image", "");
    updateFormField("imageAlt", "");
  }, [formData.image, updateFormField]);

  const uploadImageToServer = useCallback(async (): Promise<{
    url: string;
    fileName: string;
  } | null> => {
    if (!tempImageFile) {
      return null;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", tempImageFile);

      if (formData.categorySlug) {
        uploadFormData.append("categorySlug", formData.categorySlug);
      }

      const response = await fetch("/administrator/cms/api/articles/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (formData.image && formData.image.startsWith("blob:")) {
          URL.revokeObjectURL(formData.image);
        }

        setTempImageFile(null);

        return { url: data.url, fileName: data.fileName };
      } else {
        throw new Error(data.error || "Ошибка загрузки изображения");
      }
    } catch (error) {
      console.error("Ошибка загрузки изображения:", error);
      throw error;
    }
  }, [tempImageFile, formData.categorySlug, formData.image]);

  const getKeywordsArray = useCallback(() => {
    return formData.keywords
      .split(",")
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);
  }, [formData.keywords]);

  const resetForm = useCallback(() => {
    if (formData.image && formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }
    resetFormData();
    setTempImageFile(null);
    setOriginalImageUrl("");
  }, [formData.image, resetFormData, setOriginalImageUrl]);

  return {
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    resetForm,
  };
};
