import { SitemapDataResponse } from "@/types/sitemap";
import { baseUrl } from "./baseUrl";

export async function getSitemapData(): Promise<SitemapDataResponse> {
  try {
    const res = await fetch(`${baseUrl}/api/sitemap-data`);

    if (!res.ok) {
      console.error(
        `Не удалось получить данные для карты сайта: ${res.status}`
      );
    }

    const data: SitemapDataResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении данных для карты сайта:", error);
    throw error;
  }
}
