import { unstable_cache } from "next/cache";
import { getDB } from "./api-routes";

export const getSiteMetadata = unstable_cache(
  async () => {
    const defaultMetadata = {
      title: "Северяночка",
      description: "Доставка и покупка продуктов питания",
      keywords: "доставка, продукты, питание",
    };

    try {
      const db = await getDB();
      const settings = await db.collection("site-settings").findOne({});

      if (!settings) return defaultMetadata;

      return {
        title: settings.siteTitle || defaultMetadata.title,
        description: settings.metaDescription || defaultMetadata.description,
        keywords: Array.isArray(settings.semanticCore)
          ? settings.semanticCore.join(", ")
          : defaultMetadata.keywords,
      };
    } catch (error) {
      console.error("Ошибка обращения к БД:", error);
      return defaultMetadata;
    }
  },
  ["site-metadata"],
  { revalidate: 86400 }
);
