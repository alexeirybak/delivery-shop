import { ArticleCharCount, ArticleFormData } from "./article-form.types";


export interface ArticleFormFieldsProps {
  charCount: ArticleCharCount;
  onInputChange: (field: keyof ArticleFormData, value: string, maxLength?: number) => void;
  onGenerateSlug: () => void;
}

export type FormField = keyof ArticleFormData;
