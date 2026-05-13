import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { ObjectId } from "mongodb";
import { ArticleStatus } from "@/app/(user-part)/user-dashboard/science/types";

interface MessageInput {
  role: "user" | "assistant";
  content: string;
  mode?: string;
  timestamp: string | Date;
  meta?: {
    type?: "structure" | "article_part" | "full_article";
  };
}

interface UpdateFields {
  updatedAt: Date;
  title?: string;
  mode?: string;
  articleStatus?: ArticleStatus;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const {
      chatId,
      title,
      mode,
      articleStatus,
      messages,
    }: {
      chatId?: string;
      title?: string;
      mode?: string;
      messages?: MessageInput[];
      articleStatus?: ArticleStatus;
    } = await request.json();

    const db = await getDB();
    let finalChatId: string;

    if (chatId && ObjectId.isValid(chatId)) {
      const existingChat = await db.collection("scientific-articles").findOne({
        _id: new ObjectId(chatId),
        userId,
      });

      if (!existingChat) {
        return NextResponse.json({ error: "Чат не найден" }, { status: 404 });
      }

      finalChatId = chatId;

      const updateFields: UpdateFields = { updatedAt: new Date() };
      if (title) updateFields.title = title;
      if (mode) updateFields.mode = mode;
      if (articleStatus) updateFields.articleStatus = articleStatus;

      await db
        .collection("scientific-articles")
        .updateOne({ _id: new ObjectId(chatId) }, { $set: updateFields });
    } else {
      const chatResult = await db.collection("scientific-articles").insertOne({
        userId,
        title: title || `Статья от ${new Date().toLocaleString()}`,
        mode: mode || "review",
        articleStatus: articleStatus || "structure_generated",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      finalChatId = chatResult.insertedId.toString();
    }

    if (messages && messages.length > 0) {
      const messagesToInsert = messages.map((msg: MessageInput) => ({
        chatId: finalChatId,
        role: msg.role,
        content: msg.content,
        mode: msg.mode || mode,
        timestamp: new Date(msg.timestamp),
        meta: msg.meta || null,
      }));

      await db.collection("messages").insertMany(messagesToInsert);
    }

    return NextResponse.json({
      success: true,
      chatId: finalChatId,
    });
  } catch (error) {
    console.error("Ошибка сохранения чата:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
