import { getDB } from "@/lib/api-routes";
import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const recordsCount = await db.collection("records").countDocuments({
      userId,
    });

    const categoriesCount = await db
      .collection("records-category")
      .countDocuments({
        userId,
      });

    return NextResponse.json({
      recordsCount,
      categoriesCount,
    });
  } catch (error) {
    console.error("Ошибка загрузки статистики:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
