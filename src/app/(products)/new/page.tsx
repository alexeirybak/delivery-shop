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
    title: 'Новинки магазина "Северяночка"',
    description: 'Новые товары магазина "Северяночка"',
    url: `${baseUrl}/new`,
    images: {
      url: `${baseUrl}/og-images/new-og.jpg`,
      alt: 'Новинки магазина "Северяночка"',
      width: 512,
      height: 512,
    },
  },
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