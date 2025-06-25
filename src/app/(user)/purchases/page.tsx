import GenericProductsListPage from "@/app/(products)/GenericProductsListPage";
import fetchPurchases from "../fetchPurchases";

const AllPurchases = async ({
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

export default AllPurchases;
