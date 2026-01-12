import { ArticleCharCount, ArticleFormData } from "./article-form.types";

export interface ArticleFormFieldsProps {
  charCount: ArticleCharCount;
  onInputChange: (field: string, value: string, maxLength: number) => void;
  onGenerateSlug: () => void;
}

export type FormField = keyof ArticleFormData;
