import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import "./../styles/results-stats.css";

export const ResultsStats = ({}) => {
  const { totalItems, totalAllItems, searchQuery } =
    useRecordsManagementStore();
  return (
    <div className="results-stats">
      Найдено: <span className="results-stats-number">{totalItems}</span> из{" "}
      <span className="results-stats-number">{totalAllItems}</span> записей
      {searchQuery && (
        <span className="results-stats-query">
          По запросу: &quot;<span className="results-stats-query-text">{searchQuery}</span>
          &quot;
        </span>
      )}
    </div>
  );
};