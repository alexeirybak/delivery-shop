import { ArticleFormData } from "@/app/(admin)/administrator/(cms)/cms/articles/types/form/article-form.types";
import { create } from "zustand";

interface ArticleStore {
  isUploading: boolean;
  formData: ArticleFormData;
  isSubmitting: boolean;
  originalImageUrl: string;
  editingId?: string;

  setIsUploading: (isUploading: boolean) => void;
  updateFormField: <K extends keyof ArticleFormData>(
    field: K, 
    value: ArticleFormData[K]
  ) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
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
  isUploading: false,
  isSubmitting: false,
  originalImageUrl: "",
  formData: initialFormData,

  setIsUploading: (isUploading) => set({ isUploading }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
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