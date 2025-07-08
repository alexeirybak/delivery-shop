import GenericListPage from "@/app/(products)/GenericListPage";
import fetchPurchases from "../fetchPurchases";
import { Suspense } from "react";
import { Loader } from "@/components/Loader";

const AllPurchases = async ({
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
            fetchPurchases({ pagination: { startIdx, perPage } }),
          pageTitle: " Все покупки",
          basePath: "/purchases",
        }}
      />
    </Suspense>
  );
};

export default AllPurchases;
