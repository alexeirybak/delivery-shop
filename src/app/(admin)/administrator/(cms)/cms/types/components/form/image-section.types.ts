import { CategoryFormData, FormField } from "../../models/category";
import { CharCount } from "./form-fields.types";

export interface ImageSectionProps {
  formData: CategoryFormData;
  isUploading: boolean;
  isSubmitting: boolean | undefined;
  editingId: string | null;
  charCount: CharCount;
  onRemoveImage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (field: FormField, value: string, maxLength: number) => void;
}
