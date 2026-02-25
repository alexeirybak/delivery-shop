import { FilterType, SortField } from "../types";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";

export const AdvancedFilters = () => {
  const {
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    filterType,
    setFilterType,
  } = useArticlesManagementStore();

  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
  };

  const handleSortDirectionChange = (direction: "asc" | "desc") => {
    setSortDirection(direction);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Искать в:
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="text-sm w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            <option value="all">Во всех полях</option>
            <option value="name">Название</option>
            <option value="slug">Алиас</option>
            <option value="category">Категория</option>
            <option value="content">Контент</option>
            <option value="description">Описание</option>
            <option value="keywords">Ключевые слова</option>
            <option value="author">Автор</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Сортировать по:
          </label>
          <select
            value={sortField}
            onChange={(e) => handleSortFieldChange(e.target.value as SortField)}
            className="text-sm w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            <option value="numericId">ID</option>
            <option value="name">Названию</option>
            <option value="slug">Алиасу</option>
            <option value="category">Категории</option>
            <option value="isFeatured">Избранности</option>
            <option value="status">Статусу</option>
            <option value="createdAt">Дате создания</option>
            <option value="author">Автору</option>
            <option value="views">Просмотрам</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Порядок сортировки:
          </label>
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => handleSortDirectionChange("asc")}
              className={`flex-1 px-4 py-2 border rounded cursor-pointer transition-custom ${
                sortDirection === "asc"
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              По возрастанию
            </button>
            <button
              onClick={() => handleSortDirectionChange("desc")}
              className={`flex-1 px-4 py-2 border rounded cursor-pointer transition-custom ${
                sortDirection === "desc"
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              По убыванию
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
