import {
  ArticleCharCount,
  ArticleFormField,
} from "../articles/types/form/article-form.types";
import { CategoryCharCount, CategoryFormField } from "../categories/types/form";

export interface ImageSectionProps {
  type: "article" | "category";
  errors?: Record<string, string>;
  charCount: CategoryCharCount | ArticleCharCount;
  onRemoveImage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (
    field: CategoryFormField | ArticleFormField,
    value: string,
    maxLength: number
  ) => void;
}
