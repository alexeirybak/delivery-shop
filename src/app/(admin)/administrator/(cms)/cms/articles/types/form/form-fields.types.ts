import { CharCount } from "../../../types/form/form.types";
import { ArticleFormData } from "./article-form.types";

export interface ArticleFormFieldsProps {
  charCount: CharCount;
  onInputChange: (field: ArticleFormField, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}

export type ArticleFormField = keyof ArticleFormData;
