import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../../../utils/api-routes";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { role } = await request.json();
    const {id} = await params;

    const db = await getDB();

    const result = await db
      .collection("user")
      .updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: { role, updatedAt: new Date() } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Пользователь не найден или роль не изменена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      id,
      role,
    });
  } catch (error) {
    console.error("Ошибка при обновлении роли пользователя:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении роли пользователя" },
      { status: 500 }
    );
  }
}
