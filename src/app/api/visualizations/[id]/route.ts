import { NextRequest, NextResponse } from "next/server";
import { getBetterAuthSession } from "@/lib/auth-helpers";
import { getDB } from "@/lib/api-routes";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const session = await getBetterAuthSession(request.headers);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;

    const db = await getDB();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Неверный ID чата" }, { status: 400 });
    }

    const chat = await db.collection("visualizations").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

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
      messages: messages.map((m) => ({
        id: m._id.toString(),
        role: m.role,
        content: m.content,
        mode: m.mode,
        timestamp: m.timestamp,
        meta: m.meta || null,
      })),
    });
  } catch (error) {
    console.error("Ошибка загрузки чата:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const session = await getBetterAuthSession(request.headers);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;

    const db = await getDB();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Неверный ID чата" }, { status: 400 });
    }

    const chat = await db.collection("visualizations").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    });

    if (!chat) {
      return NextResponse.json({ error: "Чат не найден" }, { status: 404 });
    }

    const messagesResult = await db
      .collection("messages")
      .deleteMany({ chatId: id });

    const chatResult = await db.collection("visualizations").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
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
    });
  } catch (error) {
    console.error("Ошибка удаления чата:", error);
    return NextResponse.json(
      {
        error: "Ошибка сервера",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
