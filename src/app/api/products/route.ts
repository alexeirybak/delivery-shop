import { NextResponse } from "next/server";
import { getProductsByCategory } from "../../../../utils/api-routes";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json(
        { message: "Требуется параметр категории" },
        { status: 400 }
      );
    }

    const products = await getProductsByCategory(category);

    return NextResponse.json(products);
  } catch (error) {
    console.error("ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
