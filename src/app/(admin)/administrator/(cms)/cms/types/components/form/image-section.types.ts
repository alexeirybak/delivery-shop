import { FormField } from "../../models/category";
import { CharCount } from "./category-form.types";

export interface ImageSectionProps {
  errors: Record<string, string>;
  charCount: CharCount;
  onRemoveImage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (field: FormField, value: string, maxLength: number) => void;
}
