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
  ];

  const data = await getSitemapData();

  const categoryPages: MetadataRoute.Sitemap = data.categories.map(
    (category) => ({
      url: `${baseUrl}/catalog/${category.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })
  );

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

  return [...staticPages, ...categoryPages, ...productPages];
}
