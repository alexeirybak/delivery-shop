import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import { FilterType, SortField } from "../types";
import "../styles/advanced-filters.css";

export const AdvancedFilters = () => {
  const {
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    filterType,
    setFilterType,
  } = useRecordsManagementStore();

  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
  };

  const handleSortDirectionChange = (direction: "asc" | "desc") => {
    setSortDirection(direction);
  };

  return (
    <div className="advanced-filters">
      <div className="advanced-filters-grid">
        <div>
          <label className="advanced-filters-label">
            Искать в:
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="advanced-filters-select"
          >
            <option value="all">Во всех полях</option>
            <option value="name">Название</option>
            <option value="category">Тетрадь</option>
            <option value="content">Контент</option>
            <option value="description">Описание</option>
          </select>
        </div>

        <div>
          <label className="advanced-filters-label">
            Сортировать по:
          </label>
          <select
            value={sortField}
            onChange={(e) => handleSortFieldChange(e.target.value as SortField)}
            className="advanced-filters-select"
          >
            <option value="numericId">ID</option>
            <option value="name">Названию</option>
            <option value="categoryName">Тетради</option>
            <option value="isFeatured">Избранности</option>
            <option value="createdAt">Дате создания</option>
          </select>
        </div>

        <div>
          <label className="advanced-filters-label">
            Порядок сортировки:
          </label>
          <div className="advanced-filters-buttons">
            <button
              onClick={() => handleSortDirectionChange("asc")}
              className={`advanced-filters-sort-btn ${
                sortDirection === "asc"
                  ? "advanced-filters-sort-btn-active"
                  : "advanced-filters-sort-btn-inactive"
              }`}
            >
              По возрастанию
            </button>
            <button
              onClick={() => handleSortDirectionChange("desc")}
              className={`advanced-filters-sort-btn ${
                sortDirection === "desc"
                  ? "advanced-filters-sort-btn-active"
                  : "advanced-filters-sort-btn-inactive"
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