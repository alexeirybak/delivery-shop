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
    const res = await fetch(`${baseUrl}/api/site-settings`);
    
    if (!res.ok) {
      return defaultMetadata;
    }

    const result = await res.json();
    
    if (!result.success || !result.data) {
      return defaultMetadata;
    }

    const settings = result.data;
    
    return {
      title: settings.siteTitle || defaultMetadata.title,
      description: settings.metaDescription || defaultMetadata.description,
      keywords: settings.siteKeywords?.join(", ") || defaultMetadata.keywords,
      ogImage: `${baseUrl}/og-image.jpg`, 
    };
    
  } catch (error) {
    console.error("Ошибка получения настроек через API:", error);
    return defaultMetadata;
  }
}