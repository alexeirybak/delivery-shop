import { CharCount } from "../../../../types/form/form.types";
import { CategoryFormData } from "./category-form.types";

export interface CategoryFormFieldsProps {
  errors: Record<string, string>;
  charCount: CharCount;
  onInputChange: (field: CategoryFormField, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}

export type CategoryFormField = keyof CategoryFormData;
