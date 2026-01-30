import { MetadataRoute } from "next";
import { baseUrl } from "../../utils/baseUrl";
import { getSitemapData } from "../../utils/getSitemapData";
import { createSlug } from "../../utils/createSlug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString().split("T")[0];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/actions`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/new`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const data = await getSitemapData();

  // Добавляем категории статей (с проверкой на существование)
  const articleCategories = data.articleCategories || [];
  const articleCategoryPages: MetadataRoute.Sitemap = articleCategories.map(
    (category) => ({
      url: `${baseUrl}/blog/${category.slug}`,
      lastModified: category.updatedAt
        ? new Date(category.updatedAt).toISOString().split("T")[0]
        : currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  // Добавляем статьи (с проверкой на существование)
  const articles = data.articles || [];
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.categorySlug}/${article.slug}`,
    lastModified: article.updatedAt
      ? new Date(article.updatedAt).toISOString().split("T")[0]
      : article.publishedAt
        ? new Date(article.publishedAt).toISOString().split("T")[0]
        : currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Существующие категории продуктов
  const categoryPages: MetadataRoute.Sitemap = data.categories.map(
    (category) => ({
      url: `${baseUrl}/catalog/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }),
  );

  // Существующие товары
  const productPages: MetadataRoute.Sitemap = data.products.map((product) => {
    const productSlug = createSlug(product.title, product.id);

    return {
      url: `${baseUrl}/catalog/${product.categorySlug}/${productSlug}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt).toISOString().split("T")[0]
        : currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    };
  });

  // Возвращаем все страницы
  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...articleCategoryPages,
    ...articlePages,
  ];
}
