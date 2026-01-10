import { useCategoryStore } from "@/store/categoryStore";

export const ReorderStatus = () => {
  const { isReordering } = useCategoryStore();
  if (!isReordering) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      Обновление порядка категорий...
    </div>
  );
};
