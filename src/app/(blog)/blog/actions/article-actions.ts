"use server";

import { getDB } from "../../../../../utils/api-routes";

export async function incrementArticleViews(
  categorySlug: string, 
  articleSlug: string
) {
  try {
    const db = await getDB();

    // 1. Находим категорию
    const categoryDoc = await db.collection("article-category").findOne({
      slug: categorySlug,
    });

    if (!categoryDoc) {
      console.error("Категория не найдена:", categorySlug);
      return;
    }

    // 2. Увеличиваем счетчик просмотров для статьи
    const result = await db.collection("articles").updateOne(
      {
        categoryId: categoryDoc._id.toString(),
        slug: articleSlug,
        status: "published",
      },
      { 
        $inc: { views: 1 }
      }
    );

    console.log("Просмотры увеличены:", {
      categorySlug,
      articleSlug,
      matched: result.matchedCount,
      modified: result.modifiedCount
    });

  } catch (error) {
    console.error("Ошибка в incrementArticleViews:", error);
    // Не бросаем ошибку, чтобы не ломать страницу
  }
}