import { ArticleStatus } from "@/app/(admin)/administrator/(cms)/cms/articles/articlesManagement/types";
import { ArticleFormData } from "@/app/(admin)/administrator/(cms)/cms/articles/types";
import { create } from "zustand";

interface ApiArticle {
  _id?: string | null;
  name: string;
  slug: string;
  description?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  content?: string;
  status?: ArticleStatus;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

interface ArticleStore {
  isSubmitting: boolean;
  isUploading: boolean;
  formData: ArticleFormData;
  originalImageUrl: string;
  editingId?: string | null;

  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
  updateFormField: (
    field: keyof ArticleFormData,
    value: string | boolean,
  ) => void;
  setArticleData: (apiData: ApiArticle) => void; 
  resetFormData: () => void;
  setOriginalImageUrl: (originalImageUrl: string) => void;
}

const initialFormData: ArticleFormData = {
  _id: null,
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

  setArticleData: (apiData) =>
    set((state) => ({
      formData: {
        ...state.formData,
        _id: apiData._id || null,
        name: apiData.name,
        slug: apiData.slug,
        description: apiData.description || "",
        keywords: apiData.keywords?.join(", ") || "",
        image: apiData.image || "",
        imageAlt: apiData.imageAlt || "",
        categoryId: apiData.categoryId,
        categoryName: apiData.categoryName,
        categorySlug: apiData.categorySlug,
        content: apiData.content || "",
        status: apiData.status || "draft",
        isFeatured: Boolean(apiData.isFeatured),
        metaTitle: apiData.metaTitle || "",
        metaDescription: apiData.metaDescription || "",
      },
    })),

  resetFormData: () => set({ formData: initialFormData }),
}));