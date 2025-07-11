"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const FILTERS = [
  { key: "our-production", label: "Товары нашего производства" },
  { key: "healthy-food", label: "Полезное питание" },
  { key: "non-gmo", label: "Без ГМО" },
];

export default function FilterButtons({ basePath }: { basePath: string }) {
  const searchParams = useSearchParams();
  const currentFilters = searchParams.getAll("filter");

  const buildFilterLink = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentFilters.includes(filterKey)) {
      params.delete("filter");

      currentFilters
        .filter((f) => f !== filterKey) // Фильтруем массив, оставляя другие фильтры
        .forEach((f) => params.append("filter", f)); // Добавляем их обратно в параметры
    } else {
      params.append("filter", filterKey);
    }

    params.delete("page");

    return `${basePath}?${params.toString()}`;
  };

  const isFilterActive = (filterKey: string) =>
    currentFilters.includes(filterKey);

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      {FILTERS.map((filter) => (
        <Link
          key={filter.key}
          href={buildFilterLink(filter.key)}
          className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 cursor-pointer ${
            isFilterActive(filter.key)
              ? "bg-(--color-primary) text-white hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active)"
              : "bg-[#f3f2f1] text-[#606060] active:shadow-(--shadow-button-active) hover:shadow-(--shadow-button-secondary)"
          }`}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}
