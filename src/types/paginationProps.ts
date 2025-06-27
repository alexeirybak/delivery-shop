export interface PaginationProps {
  totalItems: number;
  currentPage: number;
  basePath: string;
  itemsPerPage: number;
  searchQuery: string;
}