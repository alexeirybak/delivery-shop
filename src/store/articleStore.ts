// store/articleStore.ts
import { ArticleFormData } from "@/app/(admin)/administrator/(cms)/cms/articles/types/form/article-form.types";
import { create } from "zustand";

interface ArticleStore {
  isUploading: boolean;
  formData: ArticleFormData;
  isSubmitting: boolean;
  originalImageUrl: string;
  editingId?: string;
  isEditMode: boolean; // Добавляем флаг режима редактирования

  setIsUploading: (isUploading: boolean) => void;
  updateFormField: (field: keyof ArticleFormData, value: string | boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  resetFormData: () => void;
  setOriginalImageUrl: (originalImageUrl: string) => void;
  setEditingId: (editingId?: string) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  loadArticleForEdit: (articleData: Partial<ArticleFormData> & { id: string }) => void;
  clearEditMode: () => void; // Для сброса режима редактирования
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
  isEditMode: false, // По умолчанию режим создания
  editingId: undefined,

  setIsUploading: (isUploading) => set({ isUploading }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setOriginalImageUrl: (originalImageUrl) => set({ originalImageUrl }),
  setEditingId: (editingId) => set({ editingId }),
  setIsEditMode: (isEditMode) => set({ isEditMode }),

  updateFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),

  // Загрузка данных для редактирования
  loadArticleForEdit: (articleData) =>
    set({
      formData: {
        ...initialFormData,
        ...articleData,
      },
      editingId: articleData.id,
      isEditMode: true,
      originalImageUrl: articleData.image || "",
    }),

  // Сброс формы с сохранением режима редактирования
  resetFormData: () =>
    set((state) => ({
      formData: initialFormData,
      // Если мы в режиме редактирования, не сбрасываем editingId
      // чтобы не потерять связь с редактируемой статьей
      editingId: state.isEditMode ? state.editingId : undefined,
    })),

  // Полный сброс (выход из режима редактирования)
  clearEditMode: () =>
    set({
      formData: initialFormData,
      editingId: undefined,
      isEditMode: false,
      originalImageUrl: "",
    }),
}));