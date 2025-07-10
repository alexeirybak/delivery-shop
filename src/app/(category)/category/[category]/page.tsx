import GenericListPage from "@/app/(products)/GenericListPage";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import { TRANSLATIONS } from "../../../../../utils/translations";
import fetchProductsByCategory from "../fetchCategory";

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
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
  params: Promise<{ category: string }>;
}) => {
  const { category } = await params;

  return (
    <Suspense fallback={<Loader />}>
      <GenericListPage
        searchParams={searchParams}
        props={{
          fetchData: ({ pagination: { startIdx, perPage } }) =>
            fetchProductsByCategory(category, {
              pagination: { startIdx, perPage },
            }),
          pageTitle: TRANSLATIONS[category] || category,
          basePath: `/category/${category}`,
          contentType: "category",
        }}
      />
    </Suspense>
  );
};

export default CategoryPage;
