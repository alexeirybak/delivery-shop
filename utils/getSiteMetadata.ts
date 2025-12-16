import { SiteSettings } from "@/app/(admin)/administrator/blog/types/siteSettings";
import { getDB } from "./api-routes";
import { baseUrl } from "./baseUrl";


export interface SiteMetadata {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export async function getSiteMetadata(): Promise<SiteMetadata> {
  let settings = null;

  try {
    const db = await getDB();
    settings = await db.collection<SiteSettings>("site-settings").findOne({});
  } catch (error) {
    console.error("Ошибка получения настроек из БД:", error);
  }

  const title = settings?.siteTitle || "Северяночка";
  const description =
    settings?.metaDescription || "Доставка и покупка продуктов питания";
  const keywords =
    settings?.siteKeywords?.join(", ") || "доставка, продукты, питание";

  const ogImage = `${baseUrl}/og-image.jpg`;

  return {
    title,
    description,
    keywords,
    ogImage,
  };
}