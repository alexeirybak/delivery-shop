import { ChevronUp, Eye, Star } from "lucide-react";
import { SortField } from "../types";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";

export const TableHeader = () => {
  const {
    currentPage,
    sortField,
    sortDirection,
    searchQuery,
    filterType,
    setSortField,
    setSortDirection,
    loadArticles,
  } = useArticlesManagementStore();

  const handleSort = async (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    await loadArticles({
      page: currentPage,
      search: searchQuery,
      filterType,
    });
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;

    return (
      <ChevronUp
        className={`w-4 h-4 ml-1 transition-transform transition-custom ${
          sortDirection === "desc" ? "rotate-180" : ""
        }`}
      />
    );
  };

  return (
    <div className="hidden lg:block border border-gray-200">
      <div className="grid lg:grid-cols-[32px_56px_100px_100px_100px_56px_128px_80px_80px_40px_100px]  xl:grid-cols-[32px_56px_170px_150px_150px_56px_128px_100px_120px_50px_100px] gap-2 px-4 py-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider items-center justify-between">
        <div></div>
        <div
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
          onClick={() => handleSort("numericId")}
          title="Сортировать по ID"
        >
          ID {renderSortIcon("numericId")}
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

        <div
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
          onClick={() => handleSort("categoryName")}
          title="Сортировать по категории"
        >
          Категория {renderSortIcon("categoryName")}
        </div>

        <div
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
          onClick={() => handleSort("isFeatured")}
          title="Сортировать по избранности"
        >
          <Star /> {renderSortIcon("isFeatured")}
        </div>

        <div
          className="cursor-pointer hover:text-gray-700 flex items-center"
          onClick={() => handleSort("status")}
          title="Сортировать по дате статусу"
        >
          Статус {renderSortIcon("status")}
        </div>
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
        <div
          className="cursor-pointer hover:text-gray-700 flex items-center"
          onClick={() => handleSort("views")}
          title="Сортировать по дате просмотрам"
        >
          <Eye /> {renderSortIcon("views")}
        </div>
        <div className="text-center">Действия</div>
      </div>
    </div>
  );
};
