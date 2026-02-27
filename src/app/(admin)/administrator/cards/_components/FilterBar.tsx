"use client";

import { useEffect, useRef, useState } from "react";
import { Filter, Search } from "lucide-react";
import { FilterBarProps, FilterType } from "../types/cards.types";
import { getFilterLabel } from "../utils/getFilterLabel";

export const FilterBar = ({
  tempFilter,
  tempSearchCardNumber,
  tempSearchOwner,
  totalItems,
  onTempFilterChange,
  onTempSearchCardNumberChange,
  onTempSearchOwnerChange,
  onApplyFilters,
  onResetFilters,
}: FilterBarProps) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
// Исправил
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Было addEventListener
    };
  }, []);
  return (
    <div className="flex flex-wrap gap-4 justify-between items-start mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <h2 className="text-xl font-semibold">
          Список карт {totalItems !== undefined && `(${totalItems})`}
        </h2>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <Filter className="h-4 w-4" />
            {getFilterLabel(tempFilter)}
          </button>

          {showFilterMenu && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {["all", "active", "inactive", "free", "assigned"].map(
                (filterType) => (
                  <button
                    key={filterType}
                    onClick={() => {
                      onTempFilterChange(filterType as FilterType);
                      setShowFilterMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      tempFilter === filterType ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {getFilterLabel(filterType)}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 w-full md:w-auto justify-between">
        <div className="relative flex-1 md:min-w-[200px]">
          <input
            type="text"
            value={tempSearchCardNumber}
            onChange={(e) => onTempSearchCardNumberChange(e.target.value)}
            placeholder="Поиск по номеру карты..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="relative flex-1 md:min-w-[200px]">
          <input
            type="text"
            value={tempSearchOwner}
            onChange={(e) => onTempSearchOwnerChange(e.target.value)}
            placeholder="Поиск по держателю..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          onClick={onApplyFilters}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Применить
        </button>

        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 cursor-pointer"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
};
