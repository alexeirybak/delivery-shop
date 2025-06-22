import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const category = new URL(request.url).searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { message: "Параметр 'category' обязателен" },
        { status: 400 }
      );
    }

    const products = await (await getDB())
      .collection("products")
      .find({ categories: category })
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Ошибка при загрузке продуктов:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
