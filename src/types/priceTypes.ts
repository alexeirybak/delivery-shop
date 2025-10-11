export interface PriceFilterProps {
  basePath: string;
  category: string;
  setIsFilterOpenAction?: (isOpen: boolean) => void;
  apiEndpoint?: string;
  userId?: string | null; 
}

export type PriceRange = {
  min: number;
  max: number;
};