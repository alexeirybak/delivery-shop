import { ResultsStatsProps } from "../../types";

export const ResultsStats = ({
  filteredCount,
  totalItems,
  searchQuery,
}: ResultsStatsProps) => {
  return (
    <div className="mt-3 text-sm text-gray-500">
      Найдено: <span className="font-medium">{filteredCount}</span> из{" "}
      <span className="font-medium">{totalItems}</span> категорий
      {searchQuery && (
        <span className="ml-4">
          По запросу: &quot;<span className="font-medium">{searchQuery}</span>
          &quot;
        </span>
      )}
    </div>
  );
};

