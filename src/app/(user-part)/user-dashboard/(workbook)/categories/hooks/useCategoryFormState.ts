"use client";

import { useCallback, useState } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { Category } from "../../records/types/categories/categories.types";

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

  const saveImageFile = useCallback(
    (file: File) => {
      setTempImageFile(file);
      const tempUrl = URL.createObjectURL(file);
      updateFormField("image", tempUrl);
    },
    [updateFormField],
  );

  const removeImage = useCallback(() => {
    if (formData.image && formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }

    setTempImageFile(null);
    updateFormField("image", "");
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

      const response = await fetch("/api/workbook/categories/upload", {
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
      console.log("=== deleteOldImage ===");
      console.log("Пришел URL:", imageUrl);

      if (!imageUrl) {
        console.log("Нет URL");
        return false;
      }

      if (imageUrl.startsWith("blob:")) {
        console.log("Это blob URL, не удаляем");
        return false;
      }

      try {
        const fileName = imageUrl.split("/").pop();
        console.log("Имя файла для удаления:", fileName);

        if (!fileName) return false;

        const response = await fetch(
          `/api/workbook/records/upload?file=${encodeURIComponent(fileName)}`,
          { method: "DELETE" },
        );

        console.log("Статус ответа:", response.status);
        return response.ok;
      } catch (error) {
        console.error("Ошибка удаления:", error);
        return false;
      }
    },
    [],
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
        description: category.description,
        image: category.image || "",
      });
      setOriginalImageUrl(category.image || "");
      setTempImageFile(null);
      setShowForm(true);
    },
    [setEditingId, setFormData, setOriginalImageUrl, setShowForm],
  );

  return {
    saveImageFile,
    removeImage,
    uploadImageToServer,
    deleteOldImage,
    startCreate,
    startEdit,
    resetForm,
  };
};
