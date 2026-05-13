import { useCategoryStore } from "@/store/categoryStore";
import { ChevronUp, ImageIcon } from "lucide-react";
import { SortField } from "../types";
import "../styles/table-header-categories.css";

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
        className={`table-header-sort-icon ${
          sortDirection === "desc" ? "rotated" : ""
        }`}
      />
    );
  };

  return (
    <div className="table-header">
      <div className="table-header-grid">
        <div className="table-header-spacer"></div>
        <div
          className="table-header-cell table-header-cell-center table-header-sortable"
          onClick={() => handleSort("numericId")}
          title="Сортировать по ID"
        >
          ID {renderSortIcon("numericId")}
        </div>
        <div
          className="table-header-cell table-header-cell-center"
          title="Изображение тетради"
        >
          <ImageIcon className="table-header-icon" />
        </div>

        <div
          className="table-header-cell table-header-cell-left table-header-sortable"
          onClick={() => handleSort("name")}
          title="Сортировать по названию"
        >
          Название {renderSortIcon("name")}
        </div>

        <div className="table-header-cell table-header-cell-left">Описание</div>
        <div
          className="table-header-cell table-header-cell-center table-header-sortable"
          onClick={() => handleSort("records")}
          title="Сортировать по кол-ву статей"
        >
          Записей {renderSortIcon("records")}
        </div>
        <div
          className="table-header-cell table-header-cell-left table-header-sortable"
          onClick={() => handleSort("createdAt")}
          title="Сортировать по дате создания"
        >
          Создана {renderSortIcon("createdAt")}
        </div>
        <div className="table-header-cell table-header-cell-center">
          Действия
        </div>
      </div>
    </div>
  );
};
