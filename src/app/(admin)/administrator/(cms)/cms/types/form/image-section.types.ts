import { ArticleFormField } from "../../articles/types";
import { CategoryFormField } from "../../categories/types";
import { CharCount } from "./form.types";

export interface ImageSectionProps {
  type: "category" | "article";
  errors?: Record<string, string>;
  charCount: CharCount;
  onRemoveImage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (
    field: CategoryFormField | ArticleFormField,
    value: string,
    maxLength: number
  ) => void;
}
