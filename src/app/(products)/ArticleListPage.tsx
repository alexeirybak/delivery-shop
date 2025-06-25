import { CONFIG } from "@/config/config";
import { PaginationWrapper } from "@/components/PaginationWrapper";
import { Article } from "@/types/articles";
import ArticleSection from "../(articles)/ArticlesSection";

interface ArticleListPageProps {
  fetchData: () => Promise<Article[]>;
  pageTitle: string;
  basePath: string;
  errorMessage: string;
}

export const ArticleListPage = async ({
  searchParams,
  props,
}: {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
  props: ArticleListPageProps;
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
        <ArticleSection
          title={props.pageTitle}
          viewAllButton={{ text: "На главную", href: "/" }}
          articles={paginatedData}
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