import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../utils/api-routes";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const db = await getDB();

    const user = await db
      .collection("user")
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { gender: 1, name: 1, surname: 1 } },
      );

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      gender: user.gender,
      fullName: `${user.name} ${user.surname}`,
    });
  } catch (error) {
    console.error("Ошибка получения пользователя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
