import { Suspense } from "react";
import fetchArticles from "../fetchArticles";
import GenericListPage from "@/app/(products)/GenericListPage";
import { Loader } from "@/components/Loader";

export const metadata = {
  title: 'Статьи на сайте магазина "Северяночка"',
  description: 'Читайте статьи на сайте магазина "Северяночка"',
};

const AllArticles = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}) => {
  return (
    <Suspense fallback={<Loader />}>
      <GenericListPage
        searchParams={searchParams}
        props={{
          fetchData: ({ pagination: { startIdx, perPage } }) =>
            fetchArticles({ pagination: { startIdx, perPage } }),
          pageTitle: " Все статьи",
          basePath: "/articles",
          contentType: "articles",
        }}
      />
    </Suspense>
  );
};

export default AllArticles;
