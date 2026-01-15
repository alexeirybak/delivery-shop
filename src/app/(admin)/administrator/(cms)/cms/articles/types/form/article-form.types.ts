export interface ArticleFormData {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  keywords: string;
  image: string;
  imageAlt: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  status: "published" | "draft" | "archived" | "deleted";
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured?: boolean;
}

export interface ArticleFormProps {
  onFieldChange: (field: ArticleFormField, value: string) => void;
  onGenerateSlug: () => void;
  onSaveImageFile: (file: File) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export interface ArticleCharCount {
  name: number;
  slug: number;
  description: number;
  keywords: number;
  imageAlt: number;
}

export interface CategorySelectProps {
  value: string;       
  onChange: (categoryId: string, categoryName: string, categorySlug: string) => void;
}

export interface ArticleFormFieldsProps {
  charCount: ArticleCharCount;
  onInputChange: (field: keyof ArticleFormData, value: string, maxLength?: number) => void;
  onGenerateSlug: () => void;
}

export type ArticleFormField = keyof ArticleFormData;