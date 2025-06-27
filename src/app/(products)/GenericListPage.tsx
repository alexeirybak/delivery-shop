import ProductsSection from "@/components/ProductsSection";
import { GenericListPageProps } from "@/types/genericListPageProps";
import { CONFIG } from "../../../config/config";
import PaginationWrapper from "@/components/PaginationWrapper";
import ArticleSection from "../(articles)/ArticlesSection";
import { ProductCardProps } from "@/types/product";
import { ArticleCardProps } from "@/types/articles";

const GenericListPage = async ({
  searchParams,
  props,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
  props: GenericListPageProps;
}) => {
  const params = await searchParams;
  const page = params?.page;
  const itemsPerPage = params?.itemsPerPage || CONFIG.ITEMS_PER_PAGE;

  const currentPage = Number(page) || 1;
  const perPage = Number(itemsPerPage);
  const startIdx = (currentPage - 1) * perPage;

  try {
    const items = await props.fetchData();
    const paginatedItems = items.slice(startIdx, startIdx + perPage);
    return (
      <>
        {!props.contentType ? (
          <ProductsSection
            title={props.pageTitle}
            products={paginatedItems as ProductCardProps[]}
          />
        ) : (
          <ArticleSection
            title={props.pageTitle}
            articles={paginatedItems as ArticleCardProps[]}
          />
        )}

        {items.length > perPage && (
          <PaginationWrapper
            totalItems={items.length}
            currentPage={currentPage}
            basePath={props.basePath}
            contentType={props.contentType}
          />
        )}
      </>
    );
  } catch {
    return <div className="text-red-500">{props.errorMessage}</div>;
  }
};

export default GenericListPage;
