import { SearchProduct } from "./searchProduct";

export interface SearchResultsProps {
  isLoading: boolean;
  query: string;
  groupedProducts: { category: string; products: SearchProduct[] }[];
  resetSearch: () => void;
}
