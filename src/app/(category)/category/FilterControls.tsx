import Link from "next/link";
import Image from "next/image";
import { FilterControlsProps } from "@/types/filterControlsProps";

const FilterControls = ({
  activeFilter,
  basePath,
  searchParams = {},
}: FilterControlsProps) => {
  function buildClearFiltersLink() {
    const params = new URLSearchParams();

    if (searchParams.page) {
      params.set("page", searchParams.page);
    }

    if (searchParams.itemsPerPage) {
      params.set("itemsPerPage", searchParams.itemsPerPage);
    }

    params.delete("filter");

    return `${basePath}?${params.toString()}`;
  }

  const activeFilterCount = activeFilter
    ? Array.isArray(activeFilter)
      ? activeFilter.length
      : 1
    : 0;

  const filterButtonText =
    activeFilterCount === 0
      ? "Фильтры"
      : activeFilterCount === 1
      ? "Фильтр 1"
      : `Фильтры ${activeFilterCount}`;

  return (
    <div className="flex flex-row gap-x-6 mb-6">
      <div
        className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 cursor-not-allowed gap-x-2 ${
          !activeFilter || activeFilter.length === 0
            ? "bg-[#f3f2f1] text-[#606060]"
            : "bg-(--color-primary) text-white"
        }`}
      >
        {filterButtonText}
      </div>
      <div
        className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 ${
          !activeFilter || activeFilter.length === 0
            ? "bg-[#f3f2f1] text-[#606060]"
            : "bg-(--color-primary) text-white"
        }`}
      >
        <Link
          href={buildClearFiltersLink()}
          className="flex items-center gap-x-2"
        >
          Очистить фильтры
          <Image
            src="/icons-products/icon-closer.svg"
            alt="Очистить фильтры"
            width={24}
            height={24}
            style={
              !activeFilter || activeFilter.length === 0
                ? {}
                : { filter: "brightness(0) invert(1)" }
            }
          />
        </Link>
      </div>
    </div>
  );
};

export default FilterControls;
