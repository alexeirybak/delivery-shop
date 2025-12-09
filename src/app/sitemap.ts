import { MetadataRoute } from "next";
import { SitemapDataResponse } from "../types/sitemap";
import { createSlug } from "../../utils/slug-generator";

async function getSitemapData(): Promise<SitemapDataResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/sitemap-data`);

    if (!res.ok) {
      console.error(`Не удалось получить данные для карты сайта: ${res.status}`);
    }

    const data: SitemapDataResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении данных для карты сайта:", error);
    throw error;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://delivery-shop.ru";
  const currentDate = new Date().toISOString().split("T")[0];

  // Статические страницы
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
  ];

  const sitemapData = await getSitemapData();

  const categoryPages: MetadataRoute.Sitemap = sitemapData.categories.map(
    (category) => ({
      url: `${baseUrl}/catalog/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })
  );

  const productPages: MetadataRoute.Sitemap = sitemapData.products.map(
    (product) => {
      const productSlug = createSlug(product.title, product.id);

      return {
        // ЧПУ URL для поисковиков
        url: `${baseUrl}/catalog/${product.categorySlug}/${productSlug}`,
        lastModified: product.updatedAt
          ? new Date(product.updatedAt).toISOString().split("T")[0]
          : currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    }
  );

  return [...staticPages, ...categoryPages, ...productPages];
}