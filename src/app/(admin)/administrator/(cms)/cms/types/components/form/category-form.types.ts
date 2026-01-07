import { FormField } from "../..";

export interface CharCount {
  name: number;
  slug: number;
  description: number;
  keywords: number;
  imageAlt: number;
}

export interface CategoryFormProps {
  errors: Record<string, string>;
  onFieldChange: (field: FormField, value: string) => void;
  onGenerateSlug: () => void;
  onSaveImageFile: (file: File) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}
