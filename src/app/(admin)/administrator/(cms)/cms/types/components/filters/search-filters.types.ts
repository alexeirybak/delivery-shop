export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  isSearching?: boolean;
}

export interface ResultsStatsProps {
  filteredCount: number;
  totalItems: number;
  searchQuery: string;
}

export interface EmptyStateProps {
  searchQuery: string;
}
