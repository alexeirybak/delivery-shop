import fetchProductsByCategory from "../fetchProducts";
import GenericProductsListPage from "../GenericProductsListPage";

export const metadata = {
  title: 'Новинки магазина "Северяночка"',
  description: 'Новые товары магазина "Северяночка"',
};

const AllNew = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}) => {
  return (
    <GenericProductsListPage
      searchParams={searchParams}
      props={{
        fetchData: () => fetchProductsByCategory("new"),
        pageTitle: " Все новинки",
        basePath: "/new",
        errorMessage: "Ошибка: не удалось загрузить новинки",
      }}
    />
  );
};

export default AllNew;
