"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FILTERS = [
  { key: "our-production", label: "Товары нашего производства" },
  { key: "healthy-food", label: "Полезное питание" },
  { key: "non-gmo", label: "Без ГМО" }
];

export default function FilterButtons({
  basePath,
}: {
  basePath: string;
}) {
  const searchParams = useSearchParams();
  const currentFilters = searchParams.getAll('filter');

  // Функция для переключения фильтров
  const toggleFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (currentFilters.includes(filterKey)) {
      // Удаляем фильтр если уже активен
      const newFilters = currentFilters.filter(f => f !== filterKey);
      params.delete('filter');
      newFilters.forEach(f => params.append('filter', f));
    } else {
      // Добавляем фильтр если не активен
      params.append('filter', filterKey);
    }

    // Сбрасываем пагинацию при изменении фильтров
    params.delete('page');
    
    return `${basePath}?${params.toString()}`;
  };

  // Проверка активности фильтра
  const isFilterActive = (filterKey: string) => {
    return currentFilters.includes(filterKey);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Кнопка "Все товары" */}
      <Link
        href={`${basePath}?${new URLSearchParams().toString()}`}
        className={`px-4 py-2 rounded-full text-sm ${
          currentFilters.length === 0
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Все товары
      </Link>

      {/* Кнопки фильтров */}
      {FILTERS.map((filter) => (
        <Link
          key={filter.key}
          href={toggleFilter(filter.key)}
          className={`px-4 py-2 rounded-full text-sm ${
            isFilterActive(filter.key)
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}