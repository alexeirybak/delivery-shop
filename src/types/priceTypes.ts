export interface PriceFilterProps {
  basePath: string;
  category: string;
}

export type PriceRange = {
  min: number;
  max: number;
};