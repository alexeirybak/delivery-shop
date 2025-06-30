import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const url = new URL(request.url);

    const category = url.searchParams.get("category");
    const randomLimit = url.searchParams.get("randomLimit");

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 }
      );
    }

    const query = {
      categories: category,
      quantity: { $gt: 0 },
    };

    if (randomLimit) {
      const pipeline = [
        { $match: query },
        { $sample: { size: parseInt(randomLimit) } },
      ];

      const products = await db
        .collection("products")
        .aggregate(pipeline)
        .toArray();
      return NextResponse.json(products);
    }

    const products = db
      .collection("products")
      .find({ categories: category })
      .toArray();
    return NextResponse.json(products);
    
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке продуктов" },
      { status: 500 }
    );
  }
}
