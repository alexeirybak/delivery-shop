import { BlogCategory } from "../types/categories.types";

export async function getCategories(): Promise<BlogCategory[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/categories`,
      {
        cache: "force-cache",
        next: {
          tags: ["categories"],
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      console.error("Ошибка HTTP:", response.status);
      return [];
    }

    const data = await response.json();

    if (data.success) {
      return data.data;
    }

    console.error("Ошибка данных:", data.message);
    return [];
  } catch (error) {
    console.error("Ошибка получения категорий:", error);
    return [];
  }
}
