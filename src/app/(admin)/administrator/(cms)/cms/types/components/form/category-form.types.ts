import { CategoryFormData, FormField } from "../../models/category";

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
