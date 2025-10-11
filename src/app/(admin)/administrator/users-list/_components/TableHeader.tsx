"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { tableStyles } from "../../styles";
import { columns } from "@/data/columnsUsersList";

interface TableHeaderProps {
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string, direction: "asc" | "desc") => void;
}

const TableHeader = ({ sortBy, sortDirection, onSort }: TableHeaderProps) => {
  const handleIconClick = (
    e: React.MouseEvent,
    field: string,
    direction: "asc" | "desc"
  ) => {
    e.stopPropagation(); 
    onSort(field, direction);
  };

  return (
    <div
      className={`hidden md:grid grid-cols-1 md:grid-cols-12 md:gap-2 rounded ${tableStyles.spacing.cell} bg-[#f3f2f1] ${tableStyles.border.bottom}`}
    >
      {columns.map(({ key, label, span, sortable }) => {
        const isActiveSort = sortBy === key;

        return (
          <div
            key={key}
            className={`${span} text-xs break-all font-semibold ${key !== "createdAt" ? tableStyles.border.right : ""} ${
              sortable ? "cursor-default" : "cursor-not-allowed opacity-50"
            } duration-300`}
          >
            <div className="flex justify-center items-center gap-1">
              {label}
              {sortable && (
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-3 w-3 cursor-pointer ${
                      isActiveSort && sortDirection === "asc"
                        ? "text-[#008c48]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={(e) => handleIconClick(e, key, "asc")}
                  />
                  <ChevronDown
                    className={`h-3 w-3 -mt-1 cursor-pointer ${
                      isActiveSort && sortDirection === "desc"
                        ? "text-[#008c48]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={(e) => handleIconClick(e, key, "desc")}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableHeader;
