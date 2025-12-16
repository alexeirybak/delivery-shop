import { getDB } from "./api-routes";
import { baseUrl } from "./baseUrl";

export interface SiteMetadata {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export async function getSiteMetadata(): Promise<SiteMetadata> {
  const defaultMetadata: SiteMetadata = {
    title: "Северяночка",
    description: "Доставка и покупка продуктов питания",
    keywords: "доставка, продукты, питание",
    ogImage: `${baseUrl}/og-image.jpg`,
  };

  try {
    const db = await getDB();
    
    const settings = await db.collection("site-settings").findOne({});

    if (!settings) {
      return defaultMetadata;
    }

    return {
      title: settings.siteTitle || defaultMetadata.title,
      description: settings.metaDescription || defaultMetadata.description,
      keywords: Array.isArray(settings.siteKeywords) 
        ? settings.siteKeywords.join(", ") 
        : defaultMetadata.keywords,
      ogImage: `${baseUrl}/og-image.jpg`, 
    };
    
  } catch (error) {
    console.error("Ошибка прямого обращения к БД для SEO:", error);
    return defaultMetadata;
  }
}
