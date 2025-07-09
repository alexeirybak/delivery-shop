import GenericListPage from "@/app/(products)/GenericListPage";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import fetchProductsByCategory from "../fetchProductsByCategory";
import { TRANSLATIONS } from "../../../../../utils/translations";

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
  searchParams: Promise<{page?: string; itemsPerPage?: string}>;
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