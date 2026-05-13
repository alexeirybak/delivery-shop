import { useCategoryStore } from "@/store/categoryStore";
import "../styles/results-stats.css";

export const ResultsStats = ({}) => {
  const { totalItems, totalAllItems, searchQuery } = useCategoryStore();
  return (
    <div className="results-stats">
      Найдено: <span className="results-stats-number">{totalItems}</span> из{" "}
      <span className="results-stats-number">{totalAllItems}</span> тетрадей
      {searchQuery && (
        <span className="results-stats-query">
          По запросу: &quot;<span className="results-stats-query-text">{searchQuery}</span>&quot;
        </span>
      )}
    </div>
  );
};