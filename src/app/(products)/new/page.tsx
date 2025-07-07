import { Loader } from "@/components/Loader";
import fetchProductsByTag from "../fetchProducts";
import GenericListPage from "../GenericListPage";
import { Suspense } from "react";

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
    <Suspense fallback={<Loader />}>
      <GenericListPage
        searchParams={searchParams}
        props={{
          fetchData: ({ pagination: { startIdx, perPage } }) =>
            fetchProductsByTag("new", { pagination: { startIdx, perPage } }),
          pageTitle: " Все новинки",
          basePath: "/new",
        }}
      />
    </Suspense>
  );
};

export default AllNew;
