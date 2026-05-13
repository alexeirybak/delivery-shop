"use client";

import { useCallback, useState } from "react";
import { useRecordStore } from "@/store/recordStore";
import { Record } from "../types";

export const useRecordFormState = () => {
  const {
    setEditingId,
    clearEditingId,
    setShowForm,
    formData,
    setFormData,
    updateFormField,
    resetFormData,
    setOriginalImageUrl,
  } = useRecordStore();
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

      const response = await fetch("/api/workbook/records/upload", {
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

      if (!imageUrl) {
        return false;
      }

      if (imageUrl.startsWith("blob:")) {
        return false;
      }

      try {
        const fileName = imageUrl.split("/").pop();

        if (!fileName) {
          return false;
        }

        const deleteUrl = `/api/workbook/records/upload?file=${encodeURIComponent(fileName)}`;

        const response = await fetch(deleteUrl, {
          method: "DELETE",
        });

        const data = await response.json();

        return data.success === true;
      } catch {
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
    (record: Record) => {
      setEditingId(record._id.toString());
      setFormData({
        name: record.name,
        description: record.description,
        image: record.image || "",
        categoryId: record.categoryId,
        categoryName: record.categoryName,
        content: record.content || "",
        isFeatured: record.isFeatured || false,
      });
      setOriginalImageUrl(record.image || "");
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
