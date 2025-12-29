import { useState, useCallback } from "react";
import { Category, CategoryFormData, FormField } from "../types";
import { transliterate } from "../../../../../../../utils/transliterate";
import { useCategoryStore } from "@/store/categoryStore";

export const useCategoryFormState = () => {
  const { setEditingId, clearEditingId } = useCategoryStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    keywords: "",
    image: "",
    imageAlt: "",
  });

  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");

  const resetForm = useCallback(() => {
    if (formData.image && formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }

    setFormData({
      name: "",
      slug: "",
      description: "",
      keywords: "",
      image: "",
      imageAlt: "",
    });
    setTempImageFile(null);
    setOriginalImageUrl("");
    clearEditingId();
    setShowForm(false);
  }, [clearEditingId, formData.image]);

  const startCreate = useCallback(() => {
    resetForm();
    setShowForm(true);
  }, [resetForm]);

  const startEdit = useCallback((category: Category) => {
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
  }, [setEditingId]);

  const updateFormField = useCallback((field: FormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

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

  const removeImage = useCallback(() => {
    if (formData.image && formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }

    setTempImageFile(null);
    updateFormField("image", "");
    updateFormField("imageAlt", "");
  }, [formData.image, updateFormField]);

  const generateSlug = useCallback(() => {
    if (!formData.name.trim()) {
      alert("Сначала введите название категории");
      return;
    }

    const slug = transliterate(formData.name, true);
    updateFormField("slug", slug);
  }, [formData.name, updateFormField]);

  const getKeywordsArray = useCallback(() => {
    return formData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
  }, [formData.keywords]);

  return {
    showForm,
    formData,
    tempImageFile,
    originalImageUrl,
    startCreate,
    startEdit,
    resetForm,
    updateFormField,
    saveImageFile,
    uploadImageToServer,
    deleteOldImage,
    removeImage,
    generateSlug,
    getKeywordsArray,
  };
};
