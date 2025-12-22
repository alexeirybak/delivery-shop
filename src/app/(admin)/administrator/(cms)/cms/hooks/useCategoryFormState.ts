"use client";

import { useCallback, useState } from "react";
import { transliterate } from "../../../../../../../utils/transliterate";

export const useCategoryFormState = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    keywords: "",
    image: "",
    imageAlt: "",
  });

  const updateFormField = useCallback((field: FormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const generateSlug = useCallback(() => {
    if (!formData.name.trim()) {
      alert("Сначала введите название категории");
      return;
    }

    const slug = transliterate(formData.name, true);
    updateFormField("slug", slug);
  }, [formData.name, updateFormField]);

  return { formData, updateFormField, generateSlug };
};
