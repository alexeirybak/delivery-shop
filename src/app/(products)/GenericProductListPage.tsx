import { CONFIG } from "@/config/config";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import ProductsSection from "@/components/ProductsSection";
import { ProductCardProps } from "@/types/product";

interface GenericProductListPageProps {
  fetchData: () => Promise<ProductCardProps[]>;
  pageTitle: string;
  basePath: string;
  errorMessage: string;
}

export const GenericProductListPage = async ({
  searchParams,
  props,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
  props: GenericProductListPageProps;
}) => {
  const params = await searchParams;
  const page = params?.page;
  const itemsPerPage = params?.itemsPerPage || CONFIG.ITEMS_PER_PAGE;

  const currentPage = Number(page) || 1;
  const perPage = Number(itemsPerPage);
  const startIdx = (currentPage - 1) * perPage;

  try {
    const data = await props.fetchData();
    const paginatedData = data.slice(startIdx, startIdx + perPage);

    return (
      <>
        <ProductsSection
          title={props.pageTitle}
          viewAllButton={{ text: "На главную", href: "/" }}
          products={paginatedData}
        />

        {data.length > perPage && (
          <PaginationWrapper
            totalItems={data.length}
            currentPage={currentPage}
            basePath={props.basePath}
          />
        )}
      </>
    );
  } catch {
    return <div className="text-red-500">{props.errorMessage}</div>;
  }
};