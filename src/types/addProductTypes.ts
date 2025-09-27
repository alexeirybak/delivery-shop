export interface AddProductFormData {
  title: string;
  description: string;
  basePrice: string;
  discountPercent: string;
  weight: string;
  quantity: string;
  article: string;
  brand: string;
  manufacturer: string;
  isHealthyFood: boolean;
  isNonGMO: boolean;
  categories: string[];
  tags: string[];
}

export interface AddProductApiResponse {
  success: boolean;
  product?: {
    _id: string;
    id: number;
    img: string;
    title: string;
  };
  error?: string;
}

export interface ImageUploadResponse {
  success: boolean;
  product?: {
    id: number;
    img: string;
    filename: string;
  };
  error?: string;
}

export interface UpdateProductApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}