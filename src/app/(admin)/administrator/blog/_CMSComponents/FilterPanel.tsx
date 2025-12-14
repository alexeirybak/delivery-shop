"use client";

import { useState } from "react";
import Dropdown from "./Dropdown";
import {
  itemsPerPageOptions,
  sortByOptions,
  statusOptions,
} from "../utils/filterOptions";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterPanelProps {
  filters: {
    search: string;
    category: string;
    status: string;
    author: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    itemsPerPage: number;
  };
  categoryOptions: Array<{ value: string; label: string }>;
  authorOptions: Array<{ value: string; label: string }>;
  onFilterChangeAction: (filters: Partial<FilterPanelProps["filters"]>) => void;
  onResetFiltersAction: () => void;
  onSortOrderToggleAction: () => void;
}

export default function FilterPanel({
  filters,
  categoryOptions,
  authorOptions,
  onFilterChangeAction,
  onResetFiltersAction,
  onSortOrderToggleAction,
}: FilterPanelProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    // Дебаунс будет в родительском компоненте
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onFilterChangeAction({ search: localSearch });
    }
  };

  const handleSearchBlur = () => {
    onFilterChangeAction({ search: localSearch });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Поиск */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Поиск по названию
          </label>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onBlur={handleSearchBlur}
            placeholder="Название статьи..."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer outline-none hover:border-gray-400 transition-colors"
          />
        </div>

        {/* Категория */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория
          </label>
          <Dropdown
            value={filters.category}
            onChangeAction={(value) =>
              onFilterChangeAction({ category: value })
            }
            options={categoryOptions}
            placeholder="Все категории"
          />
        </div>

        {/* Статус */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Статус
          </label>
          <Dropdown
            value={filters.status}
            onChangeAction={(value) => onFilterChangeAction({ status: value })}
            options={statusOptions}
            placeholder="Все статусы"
          />
        </div>

        {/* Автор */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Автор
          </label>
          <Dropdown
            value={filters.author}
            onChangeAction={(value) => onFilterChangeAction({ author: value })}
            options={authorOptions}
            placeholder="Все авторы"
          />
        </div>

        {/* Количество статей на странице */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            На странице
          </label>
          <Dropdown
            value={filters.itemsPerPage.toString()}
            onChangeAction={(value) =>
              onFilterChangeAction({ itemsPerPage: parseInt(value) })
            }
            options={itemsPerPageOptions}
            placeholder="10 статей"
          />
        </div>

        {/* Сортировка */}
        <div className="md:col-span-6 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сортировка
              </label>
              <div className="flex gap-2">
                <Dropdown
                  value={filters.sortBy}
                  onChangeAction={(value) =>
                    onFilterChangeAction({ sortBy: value })
                  }
                  options={sortByOptions}
                  placeholder="Выберите сортировку"
                  className="flex-1"
                />
                <button
                  onClick={onSortOrderToggleAction}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-colors min-w-[60px]"
                >
                  {filters.sortOrder === "desc" ? (
                    <ChevronDown />
                  ) : (
                    <ChevronUp />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={onResetFiltersAction}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
