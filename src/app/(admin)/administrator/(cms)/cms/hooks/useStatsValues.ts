import { useCategories } from "./useCategories";
import { useSiteSettings } from "./useSiteSettings";

export const useStatsValues = () => {
  const { settings } = useSiteSettings();
  const { totalAllItems } = useCategories();

  const keywordsCount = settings?.semanticCore?.length || 0;

  return {
    categoriesCount: totalAllItems,
    keywordsCount,
    publishedCount: 0,
    viewsCount: 0,
  };
};
