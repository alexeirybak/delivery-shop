import { NextRequest, NextResponse } from "next/server";
import { getBetterAuthSession } from "@/lib/auth-helpers";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const session = await getBetterAuthSession(request.headers);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { apiKey, folderId } = await request.json();

    if (!apiKey || !folderId) {
      return NextResponse.json(
        { error: "API-ключ и Folder ID обязательны" },
        { status: 400 },
      );
    }

    try {
      const testClient = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://ai.api.cloud.yandex.net/v1",
        defaultHeaders: {
          "OpenAI-Project": folderId,
        },
      });

      await testClient.chat.completions.create({
        model: `gpt://${folderId}/deepseek-v32/latest`,
        messages: [{ role: "user", content: "test" }],
        max_tokens: 1,
      });

      return NextResponse.json({ valid: true });
      
    } catch (error) {
      console.error("Ошибка валидации:", error);

      let errorMessage = "Неверный API-ключ или Folder ID";
      
      if (error && typeof error === "object") {
        const err = error as { status?: number; message?: string };
        
        if (err.status === 401) {
          errorMessage = "Неверный API-ключ";
        } else if (err.status === 403) {
          errorMessage = "Доступ запрещен. Проверьте права доступа";
        } else if (err.status === 404) {
          errorMessage = "Folder ID не найден";
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      return NextResponse.json(
        { valid: false, error: errorMessage },
        { status: 400 },
      );
    }
    
  } catch (error) {
    console.error("Ошибка валидации Yandex-ключа:", error);
    return NextResponse.json(
      { error: "Не удалось проверить API-ключ" },
      { status: 500 },
    );
  }
}