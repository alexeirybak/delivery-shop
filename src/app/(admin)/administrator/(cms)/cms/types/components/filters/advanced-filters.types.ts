import { FilterType, SortField, SortDirection } from "../table/table.types";

export interface FilterControlsProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export interface AdvancedFiltersProps {
  filterType: FilterType;
  sortField: SortField;
  sortDirection: SortDirection;
  onFilterTypeChange: (type: FilterType) => void;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
}
