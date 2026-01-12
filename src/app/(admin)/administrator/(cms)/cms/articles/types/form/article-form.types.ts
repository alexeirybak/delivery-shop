import { Category } from "../../../categories/types";

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
  onFieldChangeAction: (field: ArticleFormField, value: string) => void;
  onGenerateSlugAction: () => void;
  onSaveImageFileAction: (file: File) => void;
  onRemoveImageAction: () => void;
  onSubmitAction: (e: React.FormEvent) => void;
  onCancelAction: () => void;
  categories: Category[];
}

export interface ArticleCharCount {
  name: number;
  slug: number;
  description: number;
  keywords: number;
  imageAlt: number;
}

export type ArticleFormField = keyof ArticleFormData;
