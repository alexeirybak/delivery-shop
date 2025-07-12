export interface FilterControlsProps {
  activeFilter?: string | string[];
  basePath: string;
  searchParams?: {
    priceTo?: number | string;  
    priceFrom?: number | string;  
    page?: string;
    itemsPerPage?: string;
  };
}