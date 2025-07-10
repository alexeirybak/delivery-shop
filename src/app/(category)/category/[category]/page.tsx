import GenericListPage from "@/app/(products)/GenericListPage";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import fetchProductsByCategory from "../fetchProductsByCategory";
import { TRANSLATIONS } from "../../../../../utils/translations";
import FilterButtons from "../FilterButtons";

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
    filter?: string;
  }>;
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const activeFilter = resolvedSearchParams.filter;

  return (
    <>
      <div className="flex gap-4 mb-6 px-[max(12px,calc((100%-1208px)/2))]">
        <FilterButtons
          basePath={`/category/${category}`}
        />
      </div>

      <Suspense fallback={<Loader />}>
        <GenericListPage
          searchParams={Promise.resolve(resolvedSearchParams)}
          props={{
            fetchData: ({ pagination: { startIdx, perPage } }) =>
              fetchProductsByCategory(category, {
                pagination: { startIdx, perPage },
                filter: activeFilter, // Передаем фильтр в запрос
              }),
            pageTitle: TRANSLATIONS[category] || category,
            basePath: `/category/${category}`,
            contentType: "category",
          }}
        />
      </Suspense>
    </>
  );
};

export default CategoryPage;
