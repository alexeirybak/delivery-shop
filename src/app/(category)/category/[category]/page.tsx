import GenericListPage from "@/app/(products)/GenericListPage";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import { TRANSLATIONS } from "../../../../../utils/translations";
import fetchProductsByCategory from "../fetchCategory";
import FilterButtons from "../FilterButtons";
import FilterControls from "../FilterControls";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return {
    title: TRANSLATIONS[category] || category,
    description: `Описание категории товаров "${
      TRANSLATIONS[category] || category
    }" магазина "Северяночка"`,
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
  }>;
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const activeFilter = resolvedSearchParams.filter;

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))]">
      <h1 className="text-2xl xl:text-4xl text-left font-bold text-[#414141] mb-15">
        {TRANSLATIONS[category] || category}
      </h1>
      <FilterButtons basePath={`/category/${category}`} />
      <FilterControls
        activeFilter={resolvedSearchParams.filter}
        basePath={`/category/${category}`}
        searchParams={{
          page: resolvedSearchParams.page,
          itemsPerPage: resolvedSearchParams.itemsPerPage,
        }}
      />
      <Suspense fallback={<Loader />}>
        <GenericListPage
          searchParams={Promise.resolve(resolvedSearchParams)}
          props={{
            fetchData: ({ pagination: { startIdx, perPage } }) =>
              fetchProductsByCategory(category, {
                pagination: { startIdx, perPage },
                filter: activeFilter,
              }),
            pageTitle: "",
            basePath: `/category/${category}`,
            contentType: "category",
          }}
        />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
