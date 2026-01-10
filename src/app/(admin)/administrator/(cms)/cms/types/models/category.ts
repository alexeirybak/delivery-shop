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
export interface UpdateCategoryData {
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt: string;
  keywords: string[];
}

