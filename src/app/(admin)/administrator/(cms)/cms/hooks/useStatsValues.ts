import { useCategoryStore } from "@/store/categoryStore";
import { useSiteSettings } from "./useSiteSettings";
import { useEffect, useState } from "react";

export const useStatsValues = () => {
  const { settings } = useSiteSettings();
  const { totalAllItems, loadCategories } = useCategoryStore();
  const [publishedCount, setPublishedCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Загружаем категории
        await loadCategories();
        
        // Получаем статистику из API
        const response = await fetch('/administrator/cms/api/stats');
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки статистики');
        }
        
        const data = await response.json();
        
        // Используем те же названия переменных
        setPublishedCount(data.publishedCount || 0);
        setViewsCount(data.totalViews || 0);
        
      } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [loadCategories]);

  const keywordsCount = settings?.semanticCore?.length || 0;

  return {
    categoriesCount: totalAllItems,
    keywordsCount,
    publishedCount: publishedCount.toLocaleString('ru-RU'), 
    viewsCount: viewsCount.toLocaleString('ru-RU'), 
    loading
  };
};