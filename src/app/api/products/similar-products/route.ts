import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ProductCardProps } from "@/types/product";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "4");

    if (!productId || !category) {
      return NextResponse.json(
        { error: "ID продукта и категория обязательны" },
        { status: 400 }
      );
    }

    const db = await getDB();

    const similarProducts = await db
      .collection<ProductCardProps>("products")
      .aggregate([
        {
          $match: {
            categories: { $in: [category] },
            id: { $ne: parseInt(productId) },
          },
        },
        { $sample: { size: limit } },
      ])
      .toArray();

    return NextResponse.json({ similarProducts });
  } catch (error) {
    console.error("Ошибка получения похожих продуктов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
