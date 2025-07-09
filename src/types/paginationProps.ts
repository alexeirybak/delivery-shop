export interface PaginationProps {
  totalItems: number;
  currentPage: number;
  basePath: string;
  itemsPerPage: number;
  searchParams: { 
    page?: string; 
    itemsPerPage?: string 
  };
  searchQuery: string;
}