import { Suspense } from "react";
import { Metadata } from "next";
import fetchProductsByTag from "../fetchProducts";
import GenericListPage from "../GenericListPage";
import { Loader } from "@/components/Loader";
import { baseUrl } from "../../../../utils/baseUrl";

export const metadata: Metadata = {
  title: 'Новинки магазина "Северяночка"',
  description: 'Новые товары магазина "Северяночка"',
  openGraph: {
    title: 'Новые товары магазина "Северяночка"',
    description: 'Новое посттупление товаров в магазин "Северяночка"',
    url: `${baseUrl}/actions`,
    images: {
      url: `${baseUrl}/og-images/actions-og.jpg`,
      alt: 'Новинки магазина "Северяночка"',
      width: 512,
      height: 512,
    },
  },
};

const AllActions = async ({
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
            fetchProductsByTag("actions", {
              pagination: { startIdx, perPage },
            }),
          pageTitle: " Все акции",
          basePath: "/actions",
        }}
      />
    </Suspense>
  );
};

export default AllActions;
