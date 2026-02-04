import { useCategoryStore } from "@/store/categoryStore";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useStatsValues } from "../hooks/useStatsValues";
import { getStatValue } from "../utils/getStatValue";
import { stats } from "../utils/stats";
import { StatItem } from "./StatItem";
import { StatsSkeleton } from "./StatsSkeleton";

export const StatsSection = () => {
  const {
    categoriesCount,
    keywordsCount,
    publishedCount,
    viewsCount,
    loading,
  } = useStatsValues();
  const { loading: settingsLoading } = useSiteSettings();
  const { loading: categoriesLoading } = useCategoryStore();

  const isLoading = loading || settingsLoading || categoriesLoading;

  if (isLoading) return <StatsSkeleton />;
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Общая статистика
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            stat={stat}
            statValue={getStatValue(
              stat.title,
              categoriesCount.toString(),
              keywordsCount.toString(),
              publishedCount.toString(),
              viewsCount.toString(),
            )}
          />
        ))}
      </div>
    </div>
  );
};
