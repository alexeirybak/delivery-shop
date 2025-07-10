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
  const currentPage = searchParams.get('page');

  // Функция для переключения фильтров
const toggleFilter = (filterKey: string) => {
  const params = new URLSearchParams(searchParams.toString());
  
  // Очищаем все фильтры перед обработкой
  params.delete('filter');
  
  // Создаем новый массив фильтров
  let newFilters = [...currentFilters];
  
  if (newFilters.includes(filterKey)) {
    // Удаляем фильтр если уже активен
    newFilters = newFilters.filter(f => f !== filterKey);
  } else {
    // Добавляем фильтр если не активен
    newFilters.push(filterKey);
  }
  
  // Добавляем все активные фильтры
  newFilters.forEach(f => params.append('filter', f));
  
  // Сбрасываем пагинацию при изменении фильтров
  params.delete('page');
  
  return `${basePath}?${params.toString()}`;
};
  // Функция для кнопки "Все товары"
   const getAllProductsLink = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('filter');
    // Сохраняем параметр page, если он есть
    if (currentPage) {
      params.set('page', currentPage);
    }
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
        href={getAllProductsLink()}
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