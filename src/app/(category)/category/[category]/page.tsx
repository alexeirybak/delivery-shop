import GenericListPage from "@/app/(products)/GenericListPage";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import fetchProductsByCategory from "../fetchProductsByCategory";
import { TRANSLATIONS } from "../../../../../utils/translations";
import FilterButtons from "../FilterButtons";
import Image from "next/image";
import Link from "next/link";
import PriceFilter from "../PriceFilter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return {
    title: TRANSLATIONS[category] || category,
  };
}

const CategoryPage = async ({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    page?: string;
    itemsPerPage?: string;
    filter?: string | string[];
    priceFrom?: string;
    priceTo?: string;
    inStock?: string; // Добавляем новый параметр
  }>;
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const activeFilter = resolvedSearchParams.filter;
  const priceFrom = resolvedSearchParams.priceFrom;
  const priceTo = resolvedSearchParams.priceTo;
  const inStock = resolvedSearchParams.inStock === "true";

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))]">
      <div className="flex gap-4 mb-6">
        <FilterButtons basePath={`/category/${category}`} />
      </div>
      <div className="flex flex-row gap-x-10 justify-between">
        <div className="flex flex-col w-[272px] gap-y-10">
          <div className="h-11 bg-[#f3f2f1] rounded text-base font-bold text-[#414141] flex justify-start items-center p-2.5">
            Фильтр
          </div>
          <div>
            <PriceFilter
              basePath={`/category/${category}`}
              category={category}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row gap-x-6 px-[max(12px,calc((100%-1208px)/2))] mb-6">
            {/* Кнопки фильтров */}
            <div
              className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 cursor-pointer gap-x-2 ${
                (!activeFilter || activeFilter.length === 0) &&
                !priceFrom &&
                !priceTo
                  ? "bg-[#f3f2f1] text-[#606060] active:shadow-(--shadow-button-active) border-none transition-colors hover:shadow-(--shadow-button-secondary)"
                  : "bg-(--color-primary) text-white hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active)"
              }`}
            >
              <Link
                href={buildClearFiltersLink(
                  resolvedSearchParams,
                  `/category/${category}`
                )}
              >
                {(() => {
                  const activeFilterCount =
                    (activeFilter
                      ? Array.isArray(activeFilter)
                        ? activeFilter.length
                        : 1
                      : 0) + (priceFrom || priceTo ? 1 : 0);
                  return activeFilterCount === 0
                    ? "Фильтры"
                    : activeFilterCount === 1
                    ? "Фильтр 1"
                    : `Фильтры ${activeFilterCount}`;
                })()}
              </Link>
              <Image
                src="/icons-products/icon-closer.svg"
                alt="Очистить фильтры"
                width={24}
                height={24}
                style={
                  (!activeFilter || activeFilter.length === 0) &&
                  !priceFrom &&
                  !priceTo
                    ? {}
                    : { filter: "brightness(0) invert(1)" }
                }
              />
            </div>
            <div
              className={`h-8 p-2 rounded text-xs flex justify-center items-center duration-300 cursor-pointer gap-x-2 ${
                (!activeFilter || activeFilter.length === 0) &&
                !priceFrom &&
                !priceTo
                  ? "bg-[#f3f2f1] text-[#606060] active:shadow-(--shadow-button-active) border-none transition-colors  hover:shadow-(--shadow-button-secondary)"
                  : "bg-(--color-primary) text-white hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) "
              }`}
            >
              <Link
                href={buildClearFiltersLink(
                  resolvedSearchParams,
                  `/category/${category}`
                )}
              >
                Очистить фильтры
              </Link>
              <Image
                src="/icons-products/icon-closer.svg"
                alt="Очистить фильтры"
                width={24}
                height={24}
                style={
                  (!activeFilter || activeFilter.length === 0) &&
                  !priceFrom &&
                  !priceTo
                    ? {}
                    : { filter: "brightness(0) invert(1)" }
                }
              />
            </div>
          </div>
          <Suspense fallback={<Loader />}>
            <GenericListPage
              searchParams={Promise.resolve(resolvedSearchParams)}
              props={{
                fetchData: ({ pagination: { startIdx, perPage } }) =>
                  fetchProductsByCategory(category, {
                    pagination: { startIdx, perPage },
                    filter: activeFilter,
                    priceFrom,
                    priceTo,
                    inStock,
                  }),
                pageTitle: TRANSLATIONS[category] || category,
                basePath: `/category/${category}`,
                contentType: "category",
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function buildClearFiltersLink(
  searchParams: {
    page?: string;
    itemsPerPage?: string;
    filter?: string | string[];
    priceFrom?: string;
    priceTo?: string;
    inStock?: string;
  },
  basePath: string
) {
  const params = new URLSearchParams();

  // Копируем только нужные параметры
  if (searchParams.page) params.set("page", searchParams.page);
  if (searchParams.itemsPerPage)
    params.set("itemsPerPage", searchParams.itemsPerPage);

  // Удаляем параметры фильтров
  params.delete("filter");
  params.delete("priceFrom");
  params.delete("priceTo");
  params.delete("inStock"); // Добавляем удаление параметра inStock

  return `${basePath}?${params.toString()}`;
}

export default CategoryPage;
