import { useSiteSettings } from "./useSiteSettings";

export const useStatsValues = () => {
  const { settings } = useSiteSettings();

  const keywordsCount = settings?.semanticCore?.length || 0;

  return {
    categoriesCount: 0,
    keywordsCount,
    publishedCount: 0,
    viewsCount: 0,
  };
};
