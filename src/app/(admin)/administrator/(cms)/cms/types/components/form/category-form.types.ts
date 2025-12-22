import { CategoryFormData, FormField } from "../../models/category";

export interface CharCount {
  name: number;
  slug: number;
  description: number;
  keywords: number;
  imageAlt: number;
}

export interface CategoryFormProps {
  formData: CategoryFormData;
  errors: Record<string, string>;
  editingId: string | null;
  isSubmitting?: boolean;
  onFieldChange: (field: FormField, value: string) => void;
  onGenerateSlug: () => void;
  onSaveImageFile: (file: File) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}
