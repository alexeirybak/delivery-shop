import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { ObjectId } from "mongodb";

interface MindMapNode {
  name: string;
  children?: MindMapNode[];
}

interface SaveMessageInput {
  id?: string;
  role: "user" | "assistant";
  content: string;
  mode?: string;
  timestamp: string | Date;
  images?: Array<{ url: string; name: string; type: string }>;
  meta?: {
    type: "structure" | "article_part" | "full_article" | "mindmap";
    isDraft?: boolean;
    isError?: boolean;
    isAborted?: boolean;
    errorType?: string;
    hasError?: boolean;
    jsonData?: MindMapNode;
  };
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const { chatId, title, mode, messages } = await request.json();
    const db = await getDB();
    let finalChatId: string;

    if (chatId && ObjectId.isValid(chatId)) {
      const existingChat = await db.collection("learning").findOne({
        _id: new ObjectId(chatId),
        userId,
      });

      if (!existingChat) {
        return NextResponse.json({ error: "Чат не найден" }, { status: 404 });
      }

      finalChatId = chatId;

      await db
        .collection("learning")
        .updateOne(
          { _id: new ObjectId(chatId) },
          { $set: { updatedAt: new Date() } },
        );
    } else {
      const result = await db.collection("learning").insertOne({
        userId,
        title: title || `Чат ${new Date().toLocaleString()}`,
        mode: mode || "chat_learning",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      finalChatId = result.insertedId.toString();
    }

    if (messages && messages.length > 0) {
      const messagesToInsert = messages.map((msg: SaveMessageInput) => ({
        chatId: finalChatId,
        role: msg.role,
        content: msg.content,
        mode: msg.mode || mode,
        images: msg.images || [],
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        meta: msg.meta || null,
      }));

      await db.collection("messages").insertMany(messagesToInsert);
    }

    return NextResponse.json({
      success: true,
      chatId: finalChatId,
    });
  } catch (error) {
    console.error("Ошибка сохранения:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
