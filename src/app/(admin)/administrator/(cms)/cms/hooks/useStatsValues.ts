import { useCategoryStore } from "@/store/categoryStore";
import { useSiteSettings } from "./useSiteSettings";
import { useEffect } from "react";

export const useStatsValues = () => {
  const { settings } = useSiteSettings();
  const { totalAllItems, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keywordsCount = settings?.semanticCore?.length || 0;

  return {
    categoriesCount: totalAllItems,
    keywordsCount,
    publishedCount: 0,
    viewsCount: 0,
  };
};
