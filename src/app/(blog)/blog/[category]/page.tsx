import CategoryHeader from "./_components/CategoryHeader";
import CategoryImage from "./_components/CategoryImage";
import CategoryStats from "./_components/CategoryStats";
import EmptyCategory from "./_components/EmptyCategory";
import Pagination from "@/components/Pagination";
import { ArticlesList } from "./_components/ArticlesList";

import { CONFIG } from "../../../../../config/config";
import { getColorFromName } from "../categories/utils/getColorFromName";

import { Metadata } from "next";
import { baseUrl } from "../../../../../utils/baseUrl";
import { fetchCategoryPageData } from "./[slug]/utils/fetchCategory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  const result = await fetchCategoryPageData(category, 1, 1);

  if ("error" in result) {
    return {
      title: "Категория не найдена",
      description: "Запрашиваемая категория статей не существует.",
    };
  }

  const { category: categoryData, totalArticles } = result;

  const title = `${categoryData.name}`;
  const description = categoryData.description
    ? `${categoryData.description} ${totalArticles > 0 ? `Читайте ${totalArticles} статей по теме.` : "Статьи по данной теме."}`
    : `Читайте "${categoryData.name}". ${totalArticles > 0 ? `Доступно ${totalArticles} статей.` : ""}`;

  const keywords = [...(categoryData.keywords || []), "статьи", "блог"];

  return {
    metadataBase: new URL(`${baseUrl}/blog`),
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${categoryData.slug}`,
    },
    keywords,
    openGraph: {
      title: `${categoryData.name}`,
      description: description.substring(0, 200),
      type: "website",
      url: `${baseUrl}/blog/${categoryData.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const { page = "1" } = await searchParams;

  const itemsPerPage = CONFIG.ARTICLES_PER_BLOG_PAGE;
  const currentPage = parseInt(page) || 1;

  const result = await fetchCategoryPageData(category, currentPage, itemsPerPage);

  if ("error" in result) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Категория не найдена</h1>
        <p className="text-gray-600">Slug категории: {category}</p>
      </div>
    );
  }

  const {
    category: categoryData,
    articles: articlesData,
    totalArticles,
    totalPages,
  } = result;

  const gradientColor = getColorFromName(categoryData.name);
  const hasImage = Boolean(
    categoryData.image && categoryData.image.startsWith("/"),
  );
  const basePath = `/blog/${categoryData.slug}`;
  const searchQuery = `itemsPerPage=${itemsPerPage}&page=${currentPage}`;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col items-center gap-4">
        <CategoryHeader
          title={categoryData.name}
          description={categoryData.description}
        />
        <CategoryImage
          category={categoryData}
          gradientColor={gradientColor}
          hasImage={hasImage}
        />
      </div>

      {articlesData.length > 0 ? (
        <>
          <ArticlesList
            articles={articlesData}
            categorySlug={categoryData.slug}
            categoryName={categoryData.name}
          />

          {totalPages > 1 && (
            <Pagination
              totalItems={totalArticles}
              currentPage={currentPage}
              basePath={basePath}
              itemsPerPage={itemsPerPage}
              searchQuery={searchQuery}
            />
          )}

          <CategoryStats
            totalArticles={totalArticles}
            currentPage={currentPage}
            totalPages={totalPages}
            articlesCount={articlesData.length}
          />
        </>
      ) : (
        <EmptyCategory hasImage={hasImage} />
      )}
    </div>
  );
}