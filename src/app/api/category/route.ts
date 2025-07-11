import { ProductCardProps } from "@/types/product";
import { CONFIG } from "../../../../config/config";
import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { Filter } from "mongodb";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const startIdx = parseInt(searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE_CATEGORY.toString()
    );
    const filters = searchParams.getAll("filter");

    const query: Filter<ProductCardProps> = {};

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 }
      );
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    if (filters.length > 0) {
      query.$and = query.$and || [];

      if (filters.includes("our-production")) {
        query.$and.push({ isOurProduction: true });
      }
      if (filters.includes("healthy-food")) {
        query.$and.push({ isHealthyFood: true });
      }
      if (filters.includes("non-gmo")) {
        query.$and.push({ isNonGMO: true });
      }
    }

    const [totalCount, products] = await Promise.all([
      db.collection<ProductCardProps>("products").countDocuments(query),
      db
        .collection<ProductCardProps>("products")
        .find(query)
        .sort({ _id: 1 })
        .skip(startIdx)
        .limit(perPage)
        .toArray(),
    ]);

    return NextResponse.json({ products, totalCount });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке продуктов" },
      { status: 500 }
    );
  }
}
