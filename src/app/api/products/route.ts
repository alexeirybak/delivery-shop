import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const category = new URL(request.url).searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 }
      );
    }

    const products = await (await getDB())
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
