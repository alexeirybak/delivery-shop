import fetchProductsByCategory from "../fetchProducts";
import GenericListPage from "../GenericListPage";

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
    <GenericListPage
      searchParams={searchParams}
      props={{
        fetchData: () => fetchProductsByCategory("actions"),
        pageTitle: " Все акции",
        basePath: "/actions",
        errorMessage: "Ошибка: не удалось загрузить акции",
      }}
    />
  );
};

export default AllActions;
