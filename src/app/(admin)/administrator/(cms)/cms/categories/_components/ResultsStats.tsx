import { useCategoryStore } from "@/store/categoryStore";

export const ResultsStats = ({}) => {
  const { totalItems, totalAllItems, searchQuery } = useCategoryStore();
  return (
    <div className="mt-3 text-sm text-gray-500">
      Найдено: <span className="font-medium">{totalItems}</span> из{" "}
      <span className="font-medium">{totalAllItems}</span> категорий
      {searchQuery && (
        <span className="ml-4">
          По запросу: &quot;<span className="font-medium">{searchQuery}</span>
          &quot;
        </span>
      )}
    </div>
  );
};
