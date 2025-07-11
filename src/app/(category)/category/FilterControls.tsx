// components/FilterControls.tsx
import Link from "next/link";
import Image from "next/image";

interface FilterControlsProps {
  activeFilter?: string | string[]; // Текущие активные фильтры
  basePath: string; // Базовый путь для ссылок
  searchParams?: {
    // Дополнительные параметры URL
    page?: string;
    itemsPerPage?: string;
  };
}

export const FilterControls = ({
  activeFilter,
  basePath,
  searchParams = {},
}: FilterControlsProps) => {
  // Функция для построения ссылки сброса фильтров
  const buildClearFiltersLink = () => {
    const params = new URLSearchParams();

    // Копируем параметры пагинации
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.itemsPerPage)
      params.set("itemsPerPage", searchParams.itemsPerPage);

    return `${basePath}?${params.toString()}`;
  };

  // Подсчет количества активных фильтров
  const activeFilterCount = activeFilter
    ? Array.isArray(activeFilter)
      ? activeFilter.length
      : 1
    : 0;

  // Текст для кнопки фильтров
  const filterButtonText =
    activeFilterCount === 0
      ? "Фильтры"
      : activeFilterCount === 1
      ? "Фильтр 1"
      : `Фильтры ${activeFilterCount}`;

  return (
    <div className="flex flex-row gap-x-6 mb-6">
      {/* Кнопка "Фильтры" */}
      <div
        className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 cursor-not-allowed gap-x-2 ${
          activeFilterCount === 0
            ? "bg-[#f3f2f1] text-[#606060] border-none transition-colors"
            : "bg-(--color-primary) text-white"
        }`}
      >
        {filterButtonText}
      </div>

      {/* Кнопка "Очистить фильтры" */}
      <div
        className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 cursor-pointer gap-x-2 ${
          activeFilterCount === 0
            ? "bg-[#f3f2f1] text-[#606060] active:shadow-(--shadow-button-active) border-none transition-colors hover:shadow-(--shadow-button-secondary)"
            : "bg-(--color-primary) text-white hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active)"
        }`}
      >
        <Link href={buildClearFiltersLink()}>Очистить фильтры</Link>
        <Image
          src="/icons-products/icon-closer.svg"
          alt="Очистить фильтры"
          width={24}
          height={24}
          style={
            activeFilterCount === 0 ? {} : { filter: "brightness(0) invert(1)" }
          }
        />
      </div>
    </div>
  );
};
