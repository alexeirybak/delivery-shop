export interface BlogCategory {
  _id: string;
  numericId: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  articleCount?: number;
}

export interface BlogCategoryContentProps {
  createdAt: string;
  author?: string;
  name: string;
  description: string;
  slug: string;
}

export interface BlogCategoryMetaProps {
  createdAt: string;
  author?: string;
}

export interface BlogCategoryCardProps {
  category: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    imageAlt: string;
    createdAt: string;
    updatedAt: string;
    author: string;
  };
  priority?: boolean;
}

export interface BlogCategoriesListProps {
  categories: BlogCategory[];
}

export interface CategoriesSidebarProps {
  categories: BlogCategory[];
}

export interface CategoryImageProps {
  hasImage: boolean | string;
  image: string;
  imageAlt: string;
  gradientClass: string;
  name: string;
  priority: boolean;
}
