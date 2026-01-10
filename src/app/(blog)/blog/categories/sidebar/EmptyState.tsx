import { Search } from "lucide-react";

export default function EmptyState({
  hasSearchQuery,
}: {
  hasSearchQuery: boolean;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        {hasSearchQuery ? "Категории не найдены" : "Нет доступных категорий"}
      </p>
    </div>
  );
}
