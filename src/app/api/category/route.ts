import { CONFIG } from "../../../../config/config";
import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { Filter } from "mongodb";
import { ProductCardProps } from "@/types/product";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);

    // Получаем параметры
    const category = searchParams.get("category");
    const startIdx = Number(searchParams.get("startIdx")) || 0;
    const perPage = Number(searchParams.get("perPage")) || CONFIG.ITEMS_PER_PAGE_CATEGORY;
    const filters = searchParams.getAll("filter");

    // Базовый запрос
    const query: Filter<ProductCardProps> = {};

    // Фильтр по категории (обязательный)
    if (category) {
      query.categories = { $in: [category] };
    }

    // Добавляем условия для каждого фильтра
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
      db.collection<ProductCardProps>("products")
        .find(query)
        .sort({ _id: 1 })
        .skip(startIdx)
        .limit(perPage)
        .toArray()
    ]);

    return NextResponse.json({ 
      products, 
      totalCount,
      debug: { appliedFilters: filters } // Для отладки
    });
    
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}