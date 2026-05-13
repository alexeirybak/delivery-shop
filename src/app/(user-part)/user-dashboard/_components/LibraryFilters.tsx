import { Search, Grid3x3, List, X, ArrowUp, ArrowDown } from "lucide-react";
import { SortBy, SortOrder, CollectionType } from "../types";
import { collectionTypes } from "../utils/collectionTypes";
import { useState } from "react";

interface LibraryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  typeFilter: CollectionType;
  onTypeFilterChange: (value: CollectionType) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  sortOrder: SortOrder;
  onSortOrderToggle: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const SortIcon = ({ order }: { order: SortOrder }) => {
  if (order === "desc") return <ArrowDown className="w-3 h-3" />;
  return <ArrowUp className="w-3 h-3" />;
};

export const LibraryFilters = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  viewMode,
  onViewModeChange,
  onClearFilters,
  isLoading = false,
}: LibraryFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = () => {
    onSearchChange(localSearchQuery);
    onSearchSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleClearFilters = () => {
    setLocalSearchQuery("");
    onClearFilters();
  };

  return (
    <div className="library-filters">
      <div className="search-bar-library">
        <Search className="w-4 h-4" />
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        {localSearchQuery && (
          <button onClick={handleClearFilters} className="clear-search">
            <X className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={handleSearchSubmit}
          className="search-submit-btn"
          disabled={isLoading}
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="filter-group">
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value as CollectionType)}
          className="type-filter"
          disabled={isLoading}
        >
          {collectionTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>

        <div className="sort-group">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
            className="sort-select"
            disabled={isLoading}
          >
            <option value="createdAt">По дате создания</option>
            <option value="updatedAt">По дате обновления</option>
            <option value="title">По названию</option>
            <option value="messages">По сообщениям</option>
            <option value="favorite">По избранному</option>
          </select>
          <button
            onClick={onSortOrderToggle}
            className="sort-order-btn"
            title={sortOrder === "desc" ? "По убыванию" : "По возрастанию"}
            disabled={isLoading}
          >
            <SortIcon order={sortOrder} />
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => onViewModeChange("grid")}
            title="Сетка"
            disabled={isLoading}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => onViewModeChange("list")}
            title="Список"
            disabled={isLoading}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
