import { NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";
import { Filter } from "mongodb";
import { ProductCardProps } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const filters = searchParams.getAll("filter");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const startIdx = Number(searchParams.get("startIdx")) || 0;
    const perPage = Number(searchParams.get("perPage")) || 10;
    const getPriceRangeOnly = searchParams.get("getPriceRangeOnly") === "true";

    // Базовый запрос
    const query: Filter<ProductCardProps> = {};

    // Фильтр по категории должен быть строгим
    if (category) {
      query.categories = category; // Это ищет точное совпадение категории
    }

    // Для запроса диапазона цен мы не должны учитывать текущие фильтры по цене
    // Запрос диапазона цен
    if (getPriceRangeOnly) {
      const categoryOnlyQuery: Filter<ProductCardProps> = {};

      if (category) {
        // Правильный способ искать категорию в массиве
        categoryOnlyQuery.categories = { $in: [category] };
      }

      const priceRange = await db
        .collection<ProductCardProps>("products")
        .aggregate([
          { $match: categoryOnlyQuery },
          {
            $group: {
              _id: null,
              min: { $min: "$basePrice" },
              max: { $max: "$basePrice" },
            },
          },
        ])
        .toArray();

      return NextResponse.json({
        priceRange: {
          min: priceRange[0]?.min ?? 0,
          max: priceRange[0]?.max ?? 10000,
        },
      });
    }

    // Для обычного запроса используем полный фильтр
    if (filters.length > 0) {
      query.$and = filters
        .map((filter) => {
          switch (filter) {
            case "our-production":
              return { isOurProduction: true };
            case "healthy-food":
              return { isHealthyFood: true };
            case "non-gmo":
              return { isNonGMO: true };
            default:
              return {};
          }
        })
        .filter(Boolean);
    }

    // Фильтр по цене
    if (priceFrom || priceTo) {
      query.basePrice = {};
      if (priceFrom) query.basePrice.$gte = Number(priceFrom);
      if (priceTo) query.basePrice.$lte = Number(priceTo); // Исправлена опечатка (было $lte)
    }

    // Полный запрос с пагинацией
    const [products, totalCount] = await Promise.all([
      db
        .collection<ProductCardProps>("products")
        .find(query)
        .sort({ _id: 1 })
        .skip(startIdx)
        .limit(perPage)
        .toArray(),
      db.collection<ProductCardProps>("products").countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      totalCount,
      priceRange: { min: 0, max: 0 },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
