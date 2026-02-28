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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Было addEventListener
    };
  }, []);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-xl font-semibold">
          Список карт {totalItems !== undefined && `(${totalItems})`}
        </h2>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            {getFilterLabel(tempFilter)}
          </button>

          {showFilterMenu && (
            <div className="absolute left-0 z-10 w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
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

      <div className="flex flex-col justify-between w-full gap-3 md:flex-row md:flex-wrap md:w-auto">
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
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded-md cursor-pointer hover:bg-green-600"
        >
          <Search className="w-4 h-4" />
          Применить
        </button>

        <button
          onClick={onResetFilters}
          className="px-4 py-2 text-white bg-gray-500 rounded-md cursor-pointer hover:bg-gray-600"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
};
