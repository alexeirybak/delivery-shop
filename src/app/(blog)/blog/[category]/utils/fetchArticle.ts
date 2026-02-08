import { getUserById } from "../../../../../../utils/auth-helpers";
import { baseUrl } from "../../../../../../utils/baseUrl";
import { getServerUserId } from "../../../../../../utils/getServerUserId";
import { ArticlePageData } from "../../types";

export async function fetchArticlePageData(
  categorySlug: string,
  articleSlug: string,
): Promise<ArticlePageData | { error: string }> {
  const currentUserId = await getServerUserId();
  let currentUserData = null;
  if (currentUserId) {
    try {
      currentUserData = await getUserById(currentUserId);
    } catch (error) {
      console.error("Не удалось получить данные пользователя", error);
    }
  }

  const currentUserRole = currentUserData?.role || "user";

  console.log(currentUserRole);

  try {
    const response = await fetch(
      `${baseUrl}/api/blog/${categorySlug}/${articleSlug}?role=${currentUserRole}`,
      {
        next: { revalidate: 3600 },
      },
    );

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
