import { CategoryFormData, CharCount } from "./category-form.types";

export interface FormFieldsProps {
  errors: Record<string, string>;
  charCount: CharCount;
  onInputChange: (field: FormField, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}

export type FormField = keyof CategoryFormData;
