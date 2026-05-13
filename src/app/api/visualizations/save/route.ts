import { NextRequest, NextResponse } from "next/server";
import { getBetterAuthSession } from "@/lib/auth-helpers";
import { getDB } from "@/lib/api-routes";
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
    const session = await getBetterAuthSession(request.headers);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { chatId, title, mode, messages } = await request.json();
    const db = await getDB();
    let finalChatId: string;

    if (chatId && ObjectId.isValid(chatId)) {
      const existingChat = await db.collection("visualizations").findOne({
        _id: new ObjectId(chatId),
        userId: session.user.id,
      });

      if (!existingChat) {
        return NextResponse.json({ error: "Чат не найден" }, { status: 404 });
      }

      finalChatId = chatId;

      await db
        .collection("visualizations")
        .updateOne(
          { _id: new ObjectId(chatId) },
          { $set: { updatedAt: new Date() } },
        );
    } else {
      const result = await db.collection("visualizations").insertOne({
        userId: session.user.id,
        title: title || `Чат ${new Date().toLocaleString()}`,
        mode: mode || "mindmap",
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
        timestamp: new Date(msg.timestamp),
        meta: msg.meta || null,
        tempId: msg.id || null, // ← ДОБАВЬ ЭТУ СТРОКУ - сохраняем временный ID
      }));

      const result = await db
        .collection("messages")
        .insertMany(messagesToInsert);

      const messageIds = Object.values(result.insertedIds);
      
      // Возвращаем соответствие временных ID и реальных
      const messageIdMapping: Record<string, string> = {};
      messages.forEach((msg: SaveMessageInput, index: number) => {
        if (msg.id && messageIds[index]) {
          messageIdMapping[msg.id] = messageIds[index].toString();
        }
      });

      return NextResponse.json({
        success: true,
        chatId: finalChatId,
        messageIds,
        messageIdMapping, 
      });
    }

    return NextResponse.json({
      success: true,
      chatId: finalChatId,
    });
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}