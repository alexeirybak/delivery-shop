export interface PaginationProps {
  totalItems: number;
  currentPage: number;
  basePath: string;
  activeFilter: string;
  itemsPerPage: number;
  searchQuery: string;
}