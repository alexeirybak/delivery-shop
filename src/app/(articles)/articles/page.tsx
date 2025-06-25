import fetchArticles from "../fetchArticles";
import ArticleSection from "../ArticlesSection";

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
    <GenericProductsListPage
      searchParams={searchParams}
      props={{
        fetchData: () => fetchPurchases(),
        pageTitle: " Все покупки",
        basePath: "/purchases",
        errorMessage: "Ошибка: не удалось загрузить покупки",
      }}
    />
  );
};

export default AllArticles;
