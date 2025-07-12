import Link from "next/link";
import Image from "next/image";
import { FilterControlsProps } from "@/types/filterControlsProps";

const FilterControls = ({
  activeFilter,
  basePath,
  searchParams = {},
}: FilterControlsProps) => {
  // Получаем параметры цены из searchParams
  const minPrice = searchParams.priceFrom;
  const maxPrice = searchParams.priceTo;

  // Функция для создания ссылки с очищенными фильтрами
  const buildClearFiltersLink = () => {
    const params = new URLSearchParams();

    // Сохраняем пагинацию
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.itemsPerPage)
      params.set("itemsPerPage", searchParams.itemsPerPage);

    // Удаляем все фильтры
    params.delete("filter");
    params.delete("priceFrom");
    params.delete("priceTo");

    return `${basePath}?${params.toString()}`;
  };

  // Функция для создания ссылки с очищенным только ценовым фильтром
  const buildClearPriceFilterLink = () => {
    const params = new URLSearchParams();

    // Сохраняем все параметры кроме ценовых
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.itemsPerPage) params.set("itemsPerPage", searchParams.itemsPerPage);
    if (activeFilter) {
      const filters = Array.isArray(activeFilter) ? activeFilter : [activeFilter];
      filters.forEach(filter => params.append("filter", filter));
    }

    return `${basePath}?${params.toString()}`;
  };

  // Проверка наличия ценового фильтра
  const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;

  // Подсчет активных фильтров (включая ценовой)
  const totalActiveFilters = 
    (activeFilter ? (Array.isArray(activeFilter) ? activeFilter.length : 1) : 0) + 
    (hasPriceFilter ? 1 : 0);

  // Текст для кнопки фильтров
  const filterButtonText =
    totalActiveFilters === 0
      ? "Фильтры"
      : totalActiveFilters === 1
      ? "Фильтр 1"
      : `Фильтры ${totalActiveFilters}`;

  return (
    <div className="hidden xl:flex flex-row gap-x-6">
      {/* Кнопка всех фильтров */}
      <div
        className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 cursor-not-allowed gap-x-2 ${
          totalActiveFilters === 0
            ? "bg-[#f3f2f1] text-[#606060]"
            : "bg-(--color-primary) text-white"
        }`}
      >
        {filterButtonText}
      </div>

      {/* Кнопка ценового фильтра (только если есть ценовой фильтр) */}
      {hasPriceFilter && (
        <div className="h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-(--color-primary) text-white">
          <Link
            href={buildClearPriceFilterLink()}
            className="flex items-center gap-x-2"
          >
            Цена {minPrice !== undefined ? `от ${minPrice}` : ""} {maxPrice !== undefined ? `до ${maxPrice}` : ""}
            <Image
              src="/icons-products/icon-closer.svg"
              alt="Очистить фильтр по цене"
              width={16}
              height={16}
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        </div>
      )}

      {/* Кнопка очистки всех фильтров (отображается если есть любые фильтры) */}
      {totalActiveFilters > 0 && (
        <div className="h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-(--color-primary) text-white">
          <Link
            href={buildClearFiltersLink()}
            className="flex items-center gap-x-2"
          >
            Очистить все
            <Image
              src="/icons-products/icon-closer.svg"
              alt="Очистить все фильтры"
              width={16}
              height={16}
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default FilterControls;