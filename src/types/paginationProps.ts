export interface PaginationProps {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  basePath: string;
  itemsPerPage: number;
  searchQuery: string;
  onPageChangeAction(page: number): void;
}