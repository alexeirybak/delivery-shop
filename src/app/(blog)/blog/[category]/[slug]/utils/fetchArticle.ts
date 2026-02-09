import { baseUrl } from "../../../../../../../utils/baseUrl";
import { ArticlePageData } from "../../../types";

export async function fetchArticlePageData(
  categorySlug: string,
  articleSlug: string,
  currentUserRole?: string,
): Promise<ArticlePageData | { error: string }> {
  console.log(currentUserRole);
  try {
    const url = new URL(`${baseUrl}/api/blog/${categorySlug}/${articleSlug}`);
    
    // Добавляем роль как query-параметр
    if (currentUserRole) {
      url.searchParams.append('role', currentUserRole);
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 404) {
        return { error: errorData.error || "Не найдено" };
      }

      return { error: errorData.error || `Ошибка ${response.status}` };
    }

    const data: ArticlePageData = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при запросе статьи:", error);
    return { error: "Ошибка сети" };
  }
}