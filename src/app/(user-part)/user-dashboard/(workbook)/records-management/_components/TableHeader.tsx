import { ChevronUp, Star } from "lucide-react";
import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import { SortField } from "../types";
import "../styles/table-header-records.css";

export const TableHeader = () => {
  const {
    currentPage,
    sortField,
    sortDirection,
    searchQuery,
    filterType,
    setSortField,
    setSortDirection,
    loadRecords,
  } = useRecordsManagementStore();

  const handleSort = async (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    await loadRecords({
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
          sortDirection === "desc" ? "table-header-sort-icon-rotated" : ""
        }`}
      />
    );
  };

  return (
    <div className="table-header">
      <div className="table-header-records-grid">
        <div></div>
        <div
          className="table-header-cell table-header-cell-center table-header-sortable"
          onClick={() => handleSort("numericId")}
          title="Сортировать по ID"
        >
          ID {renderSortIcon("numericId")}
        </div>
        <div
          className="table-header-cell table-header-cell-left table-header-sortable"
          onClick={() => handleSort("name")}
          title="Сортировать по названию"
        >
          Название {renderSortIcon("name")}
        </div>

        <div
          className="table-header-cell table-header-cell-center table-header-sortable"
          onClick={() => handleSort("categoryName")}
          title="Сортировать по тетрадям"
        >
          Тетрадь {renderSortIcon("categoryName")}
        </div>

        <div
          className="table-header-cell table-header-cell-center table-header-sortable"
          onClick={() => handleSort("isFeatured")}
          title="Сортировать по избранности"
        >
          <Star className="table-header-icon" /> {renderSortIcon("isFeatured")}
        </div>

        <div
          className="table-header-cell table-header-cell-left table-header-sortable"
          onClick={() => handleSort("createdAt")}
          title="Сортировать по дате создания"
        >
          Создана {renderSortIcon("createdAt")}
        </div>
        <div className="table-header-cell table-header-cell-center">Действия</div>
      </div>
    </div>
  );
};