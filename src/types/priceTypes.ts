export interface PriceFilterProps {
  basePath: string;
  category: string;
  setIsFilterOpenAction?: (value: boolean) => void;
  apiEndpoint?: string;
  userId?: string | null;
}

export type PriceRange = {
  min: number;
  max: number;
};
