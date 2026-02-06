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
    <div className="hidden p-4 lg:block border border-gray-200">
      <div className="grid lg:grid-cols-[32px_40px_50px_100px_80px_120px_120px_80px_80px_80px_100px]  xl:grid-cols-[32px_40px_50px_120px_80px_160px_160px_80px_80px_80px_100px] gap-2 items-center justify-between">
        <div className="w-8"></div>
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
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
          onClick={() => handleSort("articles")}
          title="Сортировать по кол-ву статей"
        >
          Статей {renderSortIcon("articles")}
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
