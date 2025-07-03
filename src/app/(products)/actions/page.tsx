import fetchProductsByTag from "../fetchProducts";
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
        fetchData: ({ pagination: { startIdx, perPage } }) => fetchProductsByTag("actions", { pagination: { startIdx, perPage } }),
        pageTitle: " Все акции",
        basePath: "/actions",
        errorMessage: "Ошибка: не удалось загрузить акции",
      }}
    />
  );
};

export default AllActions;
