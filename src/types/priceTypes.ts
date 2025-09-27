export interface PriceFilterProps {
  basePath: string;
  category: string;
  setIsFilterOpenAction?: (isOpen: boolean) => void;
  apiEndpoint?: string;
  userId?: string | null; // Добавляем опциональный userId
}

export type PriceRange = {
  min: number;
  max: number;
};