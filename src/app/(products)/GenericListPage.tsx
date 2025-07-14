import ProductsSection from "@/components/ProductsSection";
import { GenericListPageProps } from "@/types/genericListPageProps";
import { CONFIG } from "../../../config/config";
import PaginationWrapper from "@/components/PaginationWrapper";
import ArticleSection from "../(articles)/ArticlesSection";
import { ProductCardProps } from "@/types/product";
import { ArticleCardProps } from "@/types/articles";
import ErrorComponent from "@/components/ErrorComponent";

const GenericListPage = async ({
  searchParams,
  props,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
  props: GenericListPageProps;
}) => {
  const params = await searchParams;
  const page = params?.page;

  const defaultItemsPerPage =
    props.contentType === "category"
      ? CONFIG.ITEMS_PER_PAGE_CATEGORY
      : CONFIG.ITEMS_PER_PAGE;

  const itemsPerPage = params?.itemsPerPage || defaultItemsPerPage;

  const currentPage = Number(page) || 1;
  const perPage = Number(itemsPerPage);
  const startIdx = (currentPage - 1) * perPage;

  try {
    const { items, totalCount } = await props.fetchData({
      pagination: { startIdx, perPage },
    });

    const totalPages = Math.ceil(totalCount / perPage);

    return (
      <>
        {!props.contentType || props.contentType === "category" ? (
          <ProductsSection
            title={props.pageTitle}
            products={items as ProductCardProps[]}
            applyIndexStyles={props.contentType === "category" ? false : true}
            contentType={props.contentType}
          />
        ) : (
          <ArticleSection
            title={props.pageTitle || ""}
            articles={items as ArticleCardProps[]}
          />
        )}

        {totalPages > 1 && (
          <PaginationWrapper
            totalItems={totalCount}
            currentPage={currentPage}
            basePath={props.basePath}
            contentType={props.contentType}
          />
        )}
      </>
    );
  } catch (error) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error : new Error(String(error))}
        userMessage="Не удалось получить элементы пагинации"
      />
    );
  }
};

export default GenericListPage;
