import { RecordFormData } from "@/app/(user-part)/user-dashboard/(workbook)/records/types";
import { create } from "zustand";

interface ApiRecord {
  _id?: string | null;
  name: string;
  description?: string;
  image?: string;
  categoryId: string;
  categoryName: string;
  content?: string;
  isFeatured?: boolean;
}

interface RecordStore {
  isSubmitting: boolean;
  isUploading: boolean;
  formData: RecordFormData;
  originalImageUrl: string;
  editingId: string | null;
  showForm: boolean;
  
  autoSaveOn: boolean;
  saveFunction: (() => void) | null;

  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
  updateFormField: (field: keyof RecordFormData, value: string | boolean) => void;
  resetFormData: () => void;
  setOriginalImageUrl: (originalImageUrl: string) => void;
  setRecordData: (apiData: ApiRecord) => void;
  setEditingId: (id: string) => void;
  clearEditingId: () => void;
  setShowForm: (show: boolean) => void;
  setFormData: (data: Partial<RecordFormData>) => void;
  setAutoSaveOn: (enabled: boolean) => void;
  setSaveFunction: (fn: (() => void) | null) => void;
}

const initialFormData: RecordFormData = {
  _id: null,
  name: "",
  description: "",
  categoryId: "",
  categoryName: "",
  image: "",
  content: "",
  isFeatured: false,
};

export const useRecordStore = create<RecordStore>((set) => ({
  isSubmitting: false,
  isUploading: false,
  formData: initialFormData,
  originalImageUrl: "",
  editingId: null,
  showForm: false,
  autoSaveOn: false,
  saveFunction: null,

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setOriginalImageUrl: (originalImageUrl) => set({ originalImageUrl }),
  
  updateFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  setRecordData: (apiData) => {
    set((state) => ({
      formData: {
        ...state.formData,
        _id: apiData._id || null,
        name: apiData.name,
        description: apiData.description || "",
        image: apiData.image || "",
        categoryId: apiData.categoryId,
        categoryName: apiData.categoryName,
        content: apiData.content || "",
        isFeatured: apiData.isFeatured || false,
      },
      originalImageUrl: apiData.image || "",
    }));
  },
  
  resetFormData: () =>
    set({
      formData: initialFormData,
      originalImageUrl: "", 
      editingId: null,
      showForm: false,
    }),

  setEditingId: (id) => set({ editingId: id }),
  clearEditingId: () => set({ editingId: null }),
  setShowForm: (show) => set({ showForm: show }),
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
    
  setAutoSaveOn: (enabled) => set({ autoSaveOn: enabled }),
  setSaveFunction: (fn) => set({ saveFunction: fn }),
}));