import { useCategoryStore } from "@/store/categoryStore";
import { ChevronUp, ImageIcon } from "lucide-react";
import { SortField } from "../types";

export const TableHeader = () => {
  const {
    currentPage,
    sortField,
    sortDirection,
    searchQuery,
    filterType,
    setSortField,
    setSortDirection,
    loadCategories,
  } = useCategoryStore();

  const handleSort = async (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    await loadCategories({
      page: currentPage,
      search: searchQuery,
      filterType,
    });
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;

    return (
      <ChevronUp
        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
          sortDirection === "desc" ? "rotate-180" : ""
        }`}
      />
    );
  };

  return (
    <div className="hidden lg:block border border-gray-200">
      <div className="grid grid-cols-[0.3fr_0.5fr_1fr_2fr_2fr_2fr_2fr_1fr_1fr_2fr] gap-2 px-2 py-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div></div>
        <div
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
          onClick={() => handleSort("numericId")}
          title="Сортировать по ID"
        >
          ID {renderSortIcon("numericId")}
        </div>
        <div
          className="text-center flex items-center justify-center"
          title="Изображение категории"
        >
          <ImageIcon className="w-4 h-4" />
        </div>

        <div
          className="cursor-pointer hover:text-gray-700 flex items-center"
          onClick={() => handleSort("name")}
          title="Сортировать по названию"
        >
          Название {renderSortIcon("name")}
        </div>
        <div
          className="cursor-pointer hover:text-gray-700 flex items-center"
          onClick={() => handleSort("slug")}
          title="Сортировать по алиасу"
        >
          Алиас {renderSortIcon("slug")}
        </div>
        <div>Описание</div>
        <div className="text-center">Ключевые слова</div>
        <div
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
          onClick={() => handleSort("author")}
          title="Сортировать по автору"
        >
          Автор {renderSortIcon("author")}
        </div>
        <div
          className="cursor-pointer hover:text-gray-700 flex items-center"
          onClick={() => handleSort("createdAt")}
          title="Сортировать по дате создания"
        >
          Создана {renderSortIcon("createdAt")}
        </div>
        <div className="text-center">Действия</div>
      </div>
    </div>
  );
};
