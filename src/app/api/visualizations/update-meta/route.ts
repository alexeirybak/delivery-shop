import { NextRequest, NextResponse } from "next/server";
import { getBetterAuthSession } from "@/lib/auth-helpers";
import { getDB } from "@/lib/api-routes";

export async function POST(request: NextRequest) {
  try {
    const session = await getBetterAuthSession(request.headers);

    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { messageId, meta } = await request.json();

    if (!messageId) {
      return NextResponse.json(
        { error: "messageId обязателен" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const { ObjectId } = await import("mongodb");

    let result;

    if (ObjectId.isValid(messageId)) {
      result = await db
        .collection("messages")
        .updateOne({ _id: new ObjectId(messageId) }, { $set: { meta } });
    } else {
      result = await db
        .collection("messages")
        .updateOne({ tempId: messageId }, { $set: { meta } });
    }

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Сообщение не найдено" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка сохранения визуализации:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
