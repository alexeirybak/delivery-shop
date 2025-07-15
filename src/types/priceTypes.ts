export interface PriceFilterProps {
  basePath: string;
  category: string;
  setIsFilterOpenAction?: (value: boolean) => void;
}

export type PriceRange = {
  min: number;
  max: number;
};
