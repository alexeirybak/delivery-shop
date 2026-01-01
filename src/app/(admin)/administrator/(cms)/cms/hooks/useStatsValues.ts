import { useCategoryStore } from "@/store/categoryStore";
import { useSiteSettings } from "./useSiteSettings";

export const useStatsValues = () => {
  const { settings } = useSiteSettings();
  const { totalAllItems } = useCategoryStore();

  const keywordsCount = settings?.semanticCore?.length || 0;

  return {
    categoriesCount: totalAllItems,
    keywordsCount,
    publishedCount: 0,
    viewsCount: 0,
  };
};
