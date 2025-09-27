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
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const getPriceRangeOnly = searchParams.get("getPriceRangeOnly") === "true";
    const inStock = searchParams.get("inStock") === "true";

    const query: Filter<ProductCardProps> = {};

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 }
      );
    }

    if (getPriceRangeOnly) {
      const categoryOnlyQuery: Filter<ProductCardProps> = {};
      categoryOnlyQuery.categories = { $in: [category] };

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
          max: priceRange[0]?.max ?? CONFIG.FALLBACK_PRICE_RANGE,
        },
      });
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    if (inStock) {
      query.quantity = { $gt: 0 };
    }

    if (filters.length > 0) {
      query.$and = query.$and || [];

      if (filters.includes("our-production")) {
        query.$and.push({ manufacturer: "Россия" });
      }
      if (filters.includes("healthy-food")) {
        query.$and.push({ isHealthyFood: true });
      }
      if (filters.includes("non-gmo")) {
        query.$and.push({ isNonGMO: true });
      }
    }

    if (priceFrom || priceTo) {
      query.basePrice = {};
      if (priceFrom) query.basePrice.$gte = parseInt(priceFrom);
      if (priceTo) query.basePrice.$lte = parseInt(priceTo);
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

    return NextResponse.json({
      products,
      totalCount,
      priceRange: { min: 0, max: 0 },
    });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке продуктов" },
      { status: 500 }
    );
  }
}