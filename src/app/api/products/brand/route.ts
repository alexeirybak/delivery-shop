import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ProductCardProps } from "@/types/product";
import { CONFIG } from "../../../../../config/config";

interface MatchCondition {
  brand: string;
  id?: { $ne: number };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const productId = searchParams.get("productId");
    const limit = CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS;

    if (!brand) {
      return NextResponse.json({ error: "Бренд обязателен" }, { status: 400 });
    }

    const db = await getDB();
    const decodedBrand = decodeURIComponent(brand);

    const matchCondition: MatchCondition = {
      brand: decodedBrand,
    };

    if (productId) {
      matchCondition.id = { $ne: parseInt(productId) };
    }

    const sameBrandProducts = await db
      .collection<ProductCardProps>("products")
      .aggregate([{ $match: matchCondition }, { $sample: { size: limit } }])
      .toArray();

    return NextResponse.json({ sameBrandProducts });
  } catch (error) {
    console.error("Ошибка получения товаров бренда:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
