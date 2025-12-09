import { SitemapDataResponse } from "@/types/sitemap";

export async function getSitemapData(): Promise<SitemapDataResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://delivery-shop.ru";

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