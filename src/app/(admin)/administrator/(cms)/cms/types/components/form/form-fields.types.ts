import { CategoryFormData, FormField } from "../../models/category";
import { CharCount } from "./category-form.types";

export interface FormFieldsProps {
  formData: CategoryFormData;
  errors: Record<string, string>;
  isSubmitting: boolean | undefined;
  charCount: CharCount;
  onInputChange: (field: FormField, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}
