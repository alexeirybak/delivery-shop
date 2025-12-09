import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDB();
    
    // Получаем все продукты с минимальными полями для sitemap
    const products = await db
      .collection("products")
      .find(
        { quantity: { $gt: 0 } }, // Только товары в наличии
        { 
          projection: { 
            id: 1, 
            _id: 1, 
            updatedAt: 1,
            slug: 1,
            title: 1 
          } 
        }
      )
      .sort({ id: 1 })
      .limit(10000) 
      .toArray();

    return NextResponse.json({ 
      success: true, 
      data: products,
      count: products.length 
    });
  } catch (error) {
    console.error("Ошибка при получении всех продуктов:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Ошибка сервера при получении продуктов" 
      },
      { status: 500 }
    );
  }
}