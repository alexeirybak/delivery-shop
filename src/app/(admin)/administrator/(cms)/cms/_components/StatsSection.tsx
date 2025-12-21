import { useCategories } from "../hooks/useCategories";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useStatsValues } from "../hooks/useStatsValues";
import stats from "../utils/stats";
import { StatItem } from "./StatItem";
import { StatsSkeleton } from "./StatsSkeleton";

export const StatsSection = () => {
  const { categoriesCount, keywordsCount } = useStatsValues();
  const { loading: categoriesLoading } = useCategories();
  const { loading: settingsLoading } = useSiteSettings();
  
  const loading = categoriesLoading || settingsLoading;

  const getStatValue = (statTitle: string) => {
    switch(statTitle) {
      case 'Категорий': return categoriesCount.toString();
      case 'Ключевых слов': return keywordsCount.toString();
      case 'Опубликовано': return "0";
      case 'Просмотров': return "0";
      default: return "0";
    }
  };

  if (loading) {
    return <StatsSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Общая статистика
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatItem
            key={stat.title}
            stat={stat}
            statValue={getStatValue(stat.title)}
          />
        ))}
      </div>
    </div>
  );
};