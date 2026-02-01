import { NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDB();
    
    // 1. Параллельно получаем все данные для скорости
    const [dbCategories, dbProducts, dbArticleCategories, dbArticles] = await Promise.all([
      // Категории продуктов (существующий запрос)
      db.collection("catalog")
        .find({})
        .project({ slug: 1 })
        .sort({ order: 1 })
        .toArray(),
      
      // Товары (существующий запрос)
      db.collection("products")
        .find(
          { quantity: { $gt: 0 } },
          {
            projection: {
              id: 1,
              title: 1,
              updatedAt: 1,
              categories: 1,
            },
          }
        )
        .limit(30000)
        .toArray(),
      
      // Категории статей (новый запрос)
      db.collection("article-category")
        .find({})
        .project({ slug: 1, updatedAt: 1 })
        .sort({ name: 1 })
        .toArray(),
      
      // Статьи (новый запрос) - только опубликованные
      db.collection("articles")
        .find(
          { status: "published" },
          {
            projection: {
              slug: 1,
              name: 1,
              categorySlug: 1,
              publishedAt: 1,
              updatedAt: 1,
            },
          }
        )
        .sort({ publishedAt: -1 })
        .toArray(),
    ]);

    // 2. Форматируем категории продуктов
    const categories = dbCategories.map((cat) => ({
      slug: cat.slug,
    }));

    // 3. Форматируем товары
    const products = dbProducts.map((product) => ({
      id: product.id,
      title: product.title || "",
      updatedAt: product.updatedAt,
      categorySlug: product.categories?.[0],
    }));

    // 4. Форматируем категории статей
    const articleCategories = dbArticleCategories.map((cat) => ({
      slug: cat.slug,
      updatedAt: cat.updatedAt,
    }));

    // 5. Форматируем статьи
    const articles = dbArticles.map((article) => ({
      slug: article.slug,
      name: article.name || "",
      categorySlug: article.categorySlug,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
    }));

    // 6. Возвращаем все данные
    return NextResponse.json({
      categories,
      products,
      articleCategories,
      articles,
    });
    
  } catch (error) {
    console.error("Sitemap data error:", error);
    return NextResponse.json(
      { error: "Failed to generate sitemap data" },
      { status: 500 }
    );
  }
}