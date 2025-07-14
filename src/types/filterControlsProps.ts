export interface FilterControlsProps {
  activeFilter?: string | string[];
  basePath: string;
  searchParams?: {
    page?: string;
    itemsPerPage?: string;
    priceFrom?: number | string | null;
    priceTo?: number | string | null;
  };
}
