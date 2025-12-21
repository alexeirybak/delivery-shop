export interface Category {
  _id: string;
  numericId: number;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  keywords: string;
  image: string;
  imageAlt: string;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  author: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  author?: string;
}

export type FormField = keyof CategoryFormData;
