import { Metadata } from "next";
import CategoriesList from "./categories/_components/CategoriesList";
import EmptyState from "./categories/_components/EmptyState";
import PageHeader from "./categories/_components/PageHeader";
import StatsInfo from "./categories/_components/StatsInfo";
import { getCategories } from "./categories/utils/getCategories";
import { baseUrl } from "../../../utils/baseUrl";
import CategoriesSidebar from "./categories/sidebar/CategoriesSidebar";

export async function generateMetadata(): Promise<Metadata> {
  const categories = await getCategories();

  const categoryNames = categories.map((cat) => cat.name);
  const description =
    categoryNames.length > 0
      ? `Исследуйте статьи по категориям: ${categoryNames.slice(0, 8).join(", ")}.`
      : "Блог с полезными статьями.";

  const keywords = [...categoryNames.map((name) => name.toLowerCase())];

  return {
    metadataBase: new URL(`${baseUrl}/blog`),
    title:
      categoryNames.length > 0
        ? `Блог: ${categoryNames.slice(0, 3).join(", ")}`
        : "Блог",

    description,
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
    keywords: [...new Set(keywords)],
  };
}

export default async function BlogPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <PageHeader />

        {categories.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <CategoriesList categories={categories} />
            <StatsInfo count={categories.length} />
          </>
        )}

        <CategoriesSidebar categories={categories} />
      </div>
    </div>
  );
}
