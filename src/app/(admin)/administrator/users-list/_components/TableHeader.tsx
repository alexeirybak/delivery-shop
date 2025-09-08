"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { tableStyles } from "../../styles";

interface TableHeaderProps {
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

const TableHeader = ({ sortBy, sortDirection, onSort }: TableHeaderProps) => {
  const columns = [
    { key: "id", label: "ID", span: tableStyles.colSpans.id, sortable: true },
    {
      key: "name",
      label: "Имя Фамилия",
      span: tableStyles.colSpans.name,
      sortable: true,
    },
    {
      key: "age",
      label: "Возраст",
      span: tableStyles.colSpans.age,
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      span: tableStyles.colSpans.email,
      sortable: true,
    },
    {
      key: "phoneNumber",
      label: "Телефон",
      span: tableStyles.colSpans.phone,
      sortable: true,
    },
    {
      key: "role",
      label: "Роль",
      span: tableStyles.colSpans.role,
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Регистрация",
      span: tableStyles.colSpans.registration,
      sortable: true,
    },
  ];

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
              sortable
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            } duration-300`}
            onClick={() => sortable && onSort(key)}
          >
            <div className="flex justify-center items-center gap-2">
              {label}
              {sortable && (
                <div className="flex flex-col">
                  <ChevronUp 
                    className={`h-4 w-4 ${isActiveSort && sortDirection === "asc" ? "text-[#008c48]" : "text-gray-400 opacity-50"}`} 
                  />
                  <ChevronDown 
                    className={`h-4 w-4 -mt-1 ${isActiveSort && sortDirection === "desc" ? "text-[#008c48]" : "text-gray-400 opacity-50"}`} 
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