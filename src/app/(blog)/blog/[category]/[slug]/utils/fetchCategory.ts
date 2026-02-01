import { baseUrl } from "../../../../../../../utils/baseUrl";
import { ApiError, CategoryPageResponse } from "../../../types";

export async function fetchCategoryPageData(
  categorySlug: string,
  page: number = 1,
  itemsPerPage: number = 3,
): Promise<CategoryPageResponse | ApiError> {
  try {
    const response = await fetch(
      `${baseUrl}/api/blog/${encodeURIComponent(categorySlug)}?page=${page}&itemsPerPage=${itemsPerPage}`,
      {
        next: {
          revalidate: 3600,
        },
      },
    );

    console.log(`${baseUrl}/api/blog/${encodeURIComponent(categorySlug)}?page=${page}&itemsPerPage=${itemsPerPage}`);

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Категория не найдена" };
      }
      return { error: "Ошибка сервера" };
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при запросе категории:", error);
    return { error: "Ошибка сети" };
  }
}
