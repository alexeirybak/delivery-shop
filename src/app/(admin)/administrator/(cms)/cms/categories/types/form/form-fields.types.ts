import { CategoryFormData, CategoryCharCount } from "./category-form.types";

export interface CategoryFormFieldsProps {
  errors: Record<string, string>;
  charCount: CategoryCharCount;
  onInputChange: (field: FormField, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}

export type FormField = keyof CategoryFormData;
