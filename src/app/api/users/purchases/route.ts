import { NextResponse } from "next/server";
import { getPurchases } from "../../../../../utils/api-routes";
export const revalidate = 3600;

export async function GET() {
  try {
    const purchases = await getPurchases();
    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
