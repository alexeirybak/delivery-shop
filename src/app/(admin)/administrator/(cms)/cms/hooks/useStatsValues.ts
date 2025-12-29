import { useCategories } from "./useCategories";
import { useSiteSettings } from "./useSiteSettings";

export const useStatsValues = () => {
  const { totalAllItems } = useCategories();
  const { settings } = useSiteSettings();

  const keywordsCount = (settings?.siteKeywords?.length || 0) + 
                       (settings?.semanticCore?.length || 0);

  return {
    categoriesCount: totalAllItems,
    keywordsCount,
    publishedCount: 0, 
    viewsCount: 0, 
  };
};
