import { FilterType } from "../table/table.types";

export interface FilterControlsProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export interface AdvancedFiltersProps {
  filterType: FilterType;
  onFilterTypeChange: (type: FilterType) => void;
}
