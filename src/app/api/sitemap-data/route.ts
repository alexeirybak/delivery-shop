import { NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDB();

    // 1. Категории - ТОЛЬКО slug
    const categoriesCollection = db.collection("catalog");
    const dbCategories = await categoriesCollection
      .find({})
      .project({ slug: 1 }) // ТОЛЬКО slug!
      .sort({ order: 1 })
      .toArray();

    // 2. Продукты - только нужные поля
    const productsCollection = db.collection("products");
    const dbProducts = await productsCollection
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
      .limit(10000) // Можно убрать, если товаров меньше
      .toArray();

    // 3. Форматируем (минимально)
    const categories = dbCategories.map((cat) => ({
      slug: cat.slug,
    }));

    const products = dbProducts.map((product) => ({
      id: product.id,
      title: product.title || "",
      updatedAt: product.updatedAt,
      categorySlug: product.categories?.[0] || "other",
    }));

    return NextResponse.json({
      categories,
      products,
      // Без count, generatedAt, success
    });
  } catch (error) {
    console.error("Sitemap data error:", error);
    return NextResponse.json(
      { error: "Failed to generate sitemap data" },
      { status: 500 }
    );
  }
}
