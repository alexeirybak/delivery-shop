import { CollectionType, SortBy, SortOrder } from "../types";
import { collectionTypes } from "../utils/collectionTypes";
import { getSortLabel } from "../utils/getSortLabel";

interface LibraryResultsInfoProps {
  filteredCount: number;
  totalCount: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  typeFilter: CollectionType;
  searchQuery: string;
  favoritesCount?: number;
  totalMaterials?: number;
}

export const LibraryResultsInfo = ({
  filteredCount,
  sortBy,
  sortOrder,
  typeFilter,
  searchQuery,
  totalMaterials,
}: LibraryResultsInfoProps) => {
  return (
    <div className="library-results-info">
      <span>
        Найдено: {filteredCount} из {totalMaterials} материалов
      </span>
      <span className="sort-info">
        Сортировка: {getSortLabel(sortBy)} ({sortOrder === "desc" ? "↓" : "↑"})
      </span>
      {typeFilter !== "all" && (
        <span className="active-filter">
          Тип: {collectionTypes.find((t) => t.id === typeFilter)?.label}
        </span>
      )}
      {searchQuery && (
        <span className="active-filter">Поиск: {searchQuery}</span>
      )}
    </div>
  );
};
