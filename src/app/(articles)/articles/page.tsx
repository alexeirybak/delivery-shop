import fetchArticles from "../fetchArticles";
import { ArticleListPage } from "@/app/(products)/ArticleListPage";

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
    <ArticleListPage
      searchParams={searchParams}
      props={{
        fetchData: () => fetchArticles(), // Передаем другую функцию получения данных
        pageTitle: "Все статьи",
        basePath: "/articles",
        errorMessage: "Ошибка: не удалось загрузить статьи",
      }}
    />
  );
};

export default AllArticles;
