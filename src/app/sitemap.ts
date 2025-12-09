import { MetadataRoute } from "next";
import { createSlug } from "../../utils/slug-generator";
import { getSitemapData } from "../../utils/getSitemapData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://delivery-shop.ru";
  const today = new Date().toISOString().split("T")[0];

  const pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/actions`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/new`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    const data = await getSitemapData();
    
    // Категории
    data.categories.forEach(category => {
      pages.push({
        url: `${baseUrl}/catalog/${category.slug}`,
        lastModified: today,
        changeFrequency: "daily",
        priority: 0.8,
      });
    });

    // Товары
    data.products.forEach(product => {
      pages.push({
        url: `${baseUrl}/catalog/${product.categorySlug}/${createSlug(product.title, product.id)}`,
        lastModified: product.updatedAt?.split('T')[0] || today,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Возвращаем хотя бы статические страницы
  }

  return pages;
}