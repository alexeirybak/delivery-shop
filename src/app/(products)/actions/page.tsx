import { GenericProductListPage } from "../GenericProductListPage";
import fetchProductsByCategory from "../fetchProducts";

export const metadata = {
  title: 'Акции магазина "Северяночка"',
  description: 'Акционные товары магазина "Северяночка"',
};

const AllActions = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}) => {
  return (
    <GenericProductListPage
      searchParams={searchParams}
      props={{
        fetchData: () => fetchProductsByCategory("actions"),
        pageTitle: "Все акции",
        basePath: "/actions",
        errorMessage: "Ошибка: не удалось загрузить акции",
      }}
    />
  );
};

export default AllActions;