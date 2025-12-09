import { NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";
import {
  CategoryForSitemap,
  ProductForSitemap,
  SitemapDataResponse,
} from "@/types/sitemap";
import { ProductCardProps } from "@/types/product";
import { CatalogProps } from "@/types/catalog";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<SitemapDataResponse>> {
  try {
    const db = await getDB();

    // 1. Получаем все категории
    const categoriesCollection = db.collection<CatalogProps>("catalog");
    const dbCategories = await categoriesCollection
      .find({})
      .project<CatalogProps>({ id: 1, slug: 1, title: 1 })
      .sort({ order: 1 })
      .toArray();

    // 2. Получаем все продукты
    const productsCollection = db.collection<ProductCardProps>("products");
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
      .sort({ id: 1 })
      .limit(10000)
      .toArray();

    // 3. Форматируем данные
    const formattedCategories: CategoryForSitemap[] = dbCategories.map(
      (category) => ({
        id: category.id,
        slug: category.slug,
        title: category.title,
      })
    );

    const formattedProducts: ProductForSitemap[] = dbProducts.map((product) => ({
      id: product.id,
      title: product.title || "",
      updatedAt: product.updatedAt,
      categorySlug: product.categories[0],
    }));

    return NextResponse.json({
      success: true,
      categories: formattedCategories,
      products: formattedProducts,
      count: {
        categories: formattedCategories.length,
        products: formattedProducts.length,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in sitemap-data API:", error);

    return NextResponse.json({
      success: false,
      categories: [],
      products: [],
      count: {
        categories: 0,
        products: 0,
      },
      generatedAt: new Date().toISOString(),
    }, { status: 500 });
  }
}