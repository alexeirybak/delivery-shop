export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  keywords: string ;
  image: string;
  imageAlt: string;
}

export interface CategoryFormProps {
  errors: Record<string, string>;
  onFieldChange: (field: CategoryFormField, value: string) => void;
  onGenerateSlug: () => void;
  onSaveImageFile: (file: File) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export interface CategoryCharCount {
  name: number;
  slug: number;
  description: number;
  keywords: number;
  imageAlt: number;
}

export type CategoryFormField = keyof CategoryFormData;