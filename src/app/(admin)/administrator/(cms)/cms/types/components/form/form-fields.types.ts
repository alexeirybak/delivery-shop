import { CharCount } from "./category-form.types";

export interface FormFieldsProps {
  errors: Record<string, string>;
  charCount: CharCount;
  onInputChange: (field: FormField, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  keywords: string;
  image: string;
  imageAlt: string;
}

export type FormField = keyof CategoryFormData;
