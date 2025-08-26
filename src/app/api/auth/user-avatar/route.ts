import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const db = await getDB();
    const userId = new ObjectId(params.userId);

    // Ищем аватар пользователя в коллекции avatars.files
    const userAvatar = await db.collection("avatars.files").findOne({
      "metadata.userId": userId
    });

    if (!userAvatar) {
      return NextResponse.json({ error: "Аватар не найден" }, { status: 404 });
    }

    return NextResponse.json({ 
      avatarId: userAvatar._id.toString()
    });

  } catch (error) {
    console.error("Error retrieving user avatar:", error);
    return NextResponse.json(
      { error: "Ошибка получения аватара пользователя" },
      { status: 500 }
    );
  }
}