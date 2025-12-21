import { CategoryFormData, FormField } from "../../models/category";

export interface CharCount {
  name: number;
  description: number;
  keywords: number;
  imageAlt: number;
}

export interface FormFieldsProps {
  formData: CategoryFormData;
  errors: Record<string, string>;
  isSubmitting: boolean | undefined;
  charCount: CharCount;
  onInputChange: (field: FormField, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}
