import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { ObjectId } from "mongodb";
import { collections } from "../../utils/collections";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const { id } = await params;
    const db = await getDB();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Неверный ID чата" }, { status: 400 });
    }

    let chat = null;
    let sourceCollection = null;

    for (const collectionName of collections) {
      const found = await db.collection(collectionName).findOne({
        _id: new ObjectId(id),
        userId,
      });
      if (found) {
        chat = found;
        sourceCollection = collectionName;
        break;
      }
    }

    if (!chat) {
      return NextResponse.json({ error: "Чат не найден" }, { status: 404 });
    }

    const messages = await db
      .collection("messages")
      .find({ chatId: id })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json({
      id: chat._id.toString(),
      title: chat.title,
      mode: chat.mode,
      sourceCollection,
      messages: messages.map((m) => ({
        id: m._id.toString(),
        role: m.role,
        content: m.content,
        mode: m.mode,
        meta: m.meta, // ← ДОБАВИТЬ ЭТУ СТРОКУ
        timestamp: m.timestamp,
      })),
    });
  } catch (error) {
    console.error("Ошибка загрузки чата:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const { id } = await params;
    const db = await getDB();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Неверный ID чата" }, { status: 400 });
    }

    let foundInCollection = null;

    for (const collectionName of collections) {
      const chat = await db.collection(collectionName).findOne({
        _id: new ObjectId(id),
        userId,
      });

      if (chat) {
        foundInCollection = collectionName;
        break;
      }
    }

    if (!foundInCollection) {
      return NextResponse.json({ error: "Чат не найден" }, { status: 404 });
    }

    const messagesResult = await db
      .collection("messages")
      .deleteMany({ chatId: id });

    const chatResult = await db.collection(foundInCollection).deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (chatResult.deletedCount === 0) {
      return NextResponse.json(
        { error: "Не удалось удалить чат" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Чат успешно удален",
      deletedMessages: messagesResult.deletedCount,
      sourceCollection: foundInCollection,
    });
  } catch (error) {
    console.error("Ошибка удаления чата:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "Ошибка сервера",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
