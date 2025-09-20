import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();

    const product = await db.collection("products").findOne({
      id: parseInt(id),
    });
 
    if (!product) {
      return NextResponse.json(
        { message: "Продукт не найден" },
        { status: 404 }
      );
    }

    const reviewsCount = await db.collection("reviews").countDocuments({
      productId: id,
    });

    const updatedProduct = { ...product };
    if (updatedProduct.rating) {
      updatedProduct.rating.count = reviewsCount;
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Ошибка при получении продукта:", error);
    return NextResponse.json(
      { message: "Ошибка сервера при получении продукта" },
      { status: 500 }
    );
  }
}