import { ArticleFormData } from "@/app/(admin)/administrator/(cms)/cms/articles/types";
import { create } from "zustand";

interface ArticleStore {
  isSubmitting: boolean;
  isUploading: boolean;
  formData: ArticleFormData;
  originalImageUrl: string;
  editingId?: string;

  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
  updateFormField: (field: keyof ArticleFormData, value: string | boolean) => void;
  resetFormData: () => void;
  setOriginalImageUrl: (originalImageUrl: string) => void;
}

const initialFormData: ArticleFormData = {
  name: "",
  slug: "",
  description: "",
  keywords: "",
  image: "",
  imageAlt: "",
  categoryId: "",
  categoryName: "",
  categorySlug: "",
  status: "draft",
  content: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
};

export const useArticleStore = create<ArticleStore>((set) => ({
  isSubmitting: false,
  isUploading: false,
  formData: initialFormData,
  originalImageUrl: "",

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setIsUploading: (isUploading) => set({ isUploading }),

  setOriginalImageUrl: (originalImageUrl) => set({ originalImageUrl }),
  updateFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  resetFormData: () =>
    set({
      formData: initialFormData,
    }),
}));
