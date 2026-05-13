import { useCategoryStore } from "@/store/categoryStore";
import { useEffect, useState } from "react";

export const useStatsValues = () => {
  const { loadCategories } = useCategoryStore();
  const [recordsCount, setRecordsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await loadCategories();

        const response = await fetch("/api/workbook/stats");

        if (!response.ok) {
          throw new Error("Ошибка загрузки статистики");
        }

        const data = await response.json();

        setRecordsCount(data.recordsCount || 0);
        setCategoriesCount(data.categoriesCount || 0);
      } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [loadCategories]);

  return {
    categoriesCount: categoriesCount, 
    recordsCount,
    loading,
  };
};