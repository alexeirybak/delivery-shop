import GenericListPage from "@/app/(products)/GenericListPage";
import fetchPurchases from "../fetchPurchases";
import { Suspense } from "react";
import { Loader } from "@/components/Loader";
import { getServerUserId } from "../../../../utils/getServerUserId";

const AllPurchases = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}) => {
  const userId = await getServerUserId();
  
  if (!userId) {
    return <div>Пожалуйста, авторизуйтесь</div>;
  }

  return (
    <Suspense fallback={<Loader />}>
      <GenericListPage
        searchParams={searchParams}
        props={{
          fetchData: ({ pagination: { startIdx, perPage } }) =>
            fetchPurchases({ 
              pagination: { startIdx, perPage },
              userId: userId 
            }),
          pageTitle: "Все покупки",
          basePath: "/purchases",
        }}
      />
    </Suspense>
  );
};

export default AllPurchases;