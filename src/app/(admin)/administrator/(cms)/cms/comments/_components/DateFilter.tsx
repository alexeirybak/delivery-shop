"use client";

import { Calendar } from "lucide-react";
import { DateFilterProps } from "../types/comments.types";

export const DateFilter = ({
  dateFrom,
  dateTo,
  activeFilter,
  onDateFromChange,
  onDateToChange,
  onSetToday,
  onSetLast3Days,
  onSetLastWeek,
  onSetLastMonth,
  onClearFilters,
  getTodayDate,
}: DateFilterProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-gray-500" />
        <span className="font-medium text-gray-700">Фильтр по дате</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={onSetToday}
          className={`px-4 py-2 text-sm rounded cursor-pointer duration-300 border ${
            activeFilter === "today"
              ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          Сегодня
        </button>
        <button
          onClick={onSetLast3Days}
          className={`px-4 py-2 text-sm rounded cursor-pointer duration-300 border ${
            activeFilter === "3days"
              ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          3 дня
        </button>
        <button
          onClick={onSetLastWeek}
          className={`px-4 py-2 text-sm rounded cursor-pointer duration-300 border ${
            activeFilter === "week"
              ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          Неделя
        </button>
        <button
          onClick={onSetLastMonth}
          className={`px-4 py-2 text-sm rounded cursor-pointer duration-300 border ${
            activeFilter === "month"
              ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          }`}
        >
          Месяц
        </button>
        {(dateFrom || dateTo) && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer duration-300 ml-auto"
          >
            Сбросить
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-4 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-xs text-gray-500 mb-1">С</label>
          <input
            type="date"
            value={dateFrom}
            onChange={onDateFromChange}
            max={dateTo || getTodayDate()}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">По</label>
          <input
            type="date"
            value={dateTo}
            onChange={onDateToChange}
            min={dateFrom}
            max={getTodayDate()}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
          />
        </div>
      </div>
    </div>
  );
};
