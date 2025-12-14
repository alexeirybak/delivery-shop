export interface FilterState {
  search: string;
  category: string;
  status: string;
  author: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  itemsPerPage: number;
}
