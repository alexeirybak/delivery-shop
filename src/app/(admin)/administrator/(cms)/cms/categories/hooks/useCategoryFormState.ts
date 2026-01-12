"use client";

import { useCallback, useState } from "react";
import { transliterate } from "../../../../../../../../utils/transliterate";
import { useCategoryStore } from "@/store/categoryStore";
import { Category } from "../types";

export const useCategoryFormState = () => {
  const {
    setEditingId,
    clearEditingId,
    setShowForm,
    formData,
    setFormData,
    updateFormField,
    resetFormData,
    setOriginalImageUrl,
  } = useCategoryStore();
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);

  const generateSlug = useCallback(() => {
    if (!formData.name.trim()) {
      alert("Сначала введите название");
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

      const response = await fetch("/administrator/cms/api/categories/upload", {
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
  }, [tempImageFile, formData.image]);

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
    clearEditingId();
    setShowForm(false);
  }, [
    clearEditingId,
    formData.image,
    resetFormData,
    setOriginalImageUrl,
    setShowForm,
  ]);

  const deleteOldImage = useCallback(
    async (imageUrl: string): Promise<boolean> => {
      if (!imageUrl || imageUrl.startsWith("blob:")) {
        return true;
      }

      try {
        const fileName = imageUrl.split("/").pop();
        if (!fileName) return true;

        const response = await fetch(
          `/administrator/cms/api/categories/upload?file=${encodeURIComponent(fileName)}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();
        return data.success === true;
      } catch (error) {
        console.error("Ошибка удаления старого изображения:", error);
        return false;
      }
    },
    []
  );

  const startCreate = useCallback(() => {
    resetForm();
    setShowForm(true);
  }, [resetForm, setShowForm]);

  const startEdit = useCallback(
    (category: Category) => {
      setEditingId(category._id.toString());
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        keywords: (category.keywords || []).join(", "),
        image: category.image || "",
        imageAlt: category.imageAlt || "",
      });
      setOriginalImageUrl(category.image || "");
      setTempImageFile(null);
      setShowForm(true);
    },
    [setEditingId, setFormData, setOriginalImageUrl, setShowForm]
  );

  return {
    generateSlug,
    saveImageFile,
    removeImage,
    uploadImageToServer,
    getKeywordsArray,
    deleteOldImage,
    startCreate,
    startEdit,
    resetForm,
  };
};
