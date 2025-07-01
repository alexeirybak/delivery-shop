import fetchArticles from "../fetchArticles";
import GenericListPage from "@/app/(products)/GenericListPage";

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
    <GenericListPage
      searchParams={searchParams}
      props={{fetchData: ({ pagination: { startIdx, perPage } }) => fetchArticles({ pagination: { startIdx, perPage } }),
        pageTitle: " Все статьи",
        basePath: "/articles",
        errorMessage: "Ошибка: не удалось загрузить статьи",
        contentType: "articles",
      }}
    />
  );
};

export default AllArticles;
