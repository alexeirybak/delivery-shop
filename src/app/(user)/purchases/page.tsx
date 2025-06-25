import { GenericProductListPage } from "@/app/(products)/GenericProductListPage";
import fetchPurchases from "../fetchPurchases";

const AllPurchases = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}) => {
  return (
    <GenericProductListPage
      searchParams={searchParams}
      props={{
        fetchData: () => fetchPurchases(), // Передаем другую функцию получения данных
        pageTitle: "Все покупки",
        basePath: "/purchases",
        errorMessage: "Ошибка: не удалось загрузить покупки",
      }}
    />
  );
};

export default AllPurchases;