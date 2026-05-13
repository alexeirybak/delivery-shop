import { useCategoryStore } from "@/store/categoryStore";
import { stats } from "../utils/stats";
import { useStatsValues } from "../hooks/useStatsValues";
import { StatsSkeleton } from "./StatsSkeleton";
import { StatItem } from "./StatItem";
import { getStatValue } from "../utils/getStatValue";
import "../../styles/stats-section.css";

export const StatsSection = () => {
  const { categoriesCount, recordsCount, loading } = useStatsValues();
  const { loading: categoriesLoading } = useCategoryStore();

  const isLoading = loading || categoriesLoading;

  if (isLoading) return <StatsSkeleton />;

  return (
    <div className="stats-section">
      <h2 className="stats-section-title">Общая статистика</h2>
      <div className="stats-section-grid">
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            stat={stat}
            statValue={getStatValue(
              stat.title,
              categoriesCount.toString(),
              recordsCount.toString(),
            )}
          />
        ))}
      </div>
    </div>
  );
};
