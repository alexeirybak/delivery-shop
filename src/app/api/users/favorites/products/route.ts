import { ProductCardProps } from "@/types/product";
import { CONFIG } from "../../../../../../config/config";
import { getDB } from "../../../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { Filter } from "mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const startIdx = parseInt(searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE_CATEGORY.toString()
    );
    const filters = searchParams.getAll("filter");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const getPriceRangeOnly = searchParams.get("getPriceRangeOnly") === "true";
    const inStock = searchParams.get("inStock") === "true";
    const userId = searchParams.get("userId");

    if (!userId) {
      if (getPriceRangeOnly) {
        return NextResponse.json({
          priceRange: CONFIG.FALLBACK_PRICE_RANGE
        });
      }
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    if (getPriceRangeOnly) {
      const user = await db
        .collection("user")
        .findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return NextResponse.json({
          priceRange: CONFIG.FALLBACK_PRICE_RANGE
        });
      }

      const favoriteProductIds = user.favorites || [];
      
      const numericFavoriteIds = favoriteProductIds
        .map((id: string) => parseInt(id))
        .filter((id: number) => !isNaN(id));
      
      if (numericFavoriteIds.length === 0) {
        return NextResponse.json({
          priceRange: CONFIG.FALLBACK_PRICE_RANGE
        });
      }

      const query: Filter<ProductCardProps> = {
        id: { $in: numericFavoriteIds } 
      };

      const priceRange = await db
        .collection<ProductCardProps>("products")
        .aggregate([
          { $match: query },
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
          min: priceRange[0]?.min ?? CONFIG.FALLBACK_PRICE_RANGE.min,
          max: priceRange[0]?.max ?? CONFIG.FALLBACK_PRICE_RANGE.max,
        },
      });
    }

    const user = await db
      .collection("user")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    const favoriteProductIds = user.favorites || [];
    
    const numericFavoriteIds = favoriteProductIds
      .map((id: string) => parseInt(id))
      .filter((id: number) => !isNaN(id));
    
    if (numericFavoriteIds.length === 0) {
      return NextResponse.json({ 
        products: [], 
        totalCount: 0,
        priceRange: CONFIG.FALLBACK_PRICE_RANGE
      });
    }    

    const query: Filter<ProductCardProps> = {
      id: { $in: numericFavoriteIds } 
    };

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
      if (priceFrom) {
        query.basePrice.$gte = parseInt(priceFrom);
      }
      if (priceTo) {
        query.basePrice.$lte = parseInt(priceTo);
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

    const actualPriceRange = products.length > 0 ? {
      min: Math.min(...products.map((p) => p.basePrice)),
      max: Math.max(...products.map((p) => p.basePrice))
    } : CONFIG.FALLBACK_PRICE_RANGE;

    return NextResponse.json({
      products,
      totalCount,
      priceRange: actualPriceRange,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка при загрузке избранных товаров", error },
      { status: 500 }
    );
  }
}