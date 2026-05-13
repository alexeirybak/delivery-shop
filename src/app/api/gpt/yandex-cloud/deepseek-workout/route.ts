import { NextRequest, NextResponse } from "next/server";
import { getYandexClient } from "@/lib/yandex-client";
import { buildSystemPrompt } from "@/app/(user-part)/prompts/prompt-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, action = "improve" } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          error: "Неверный запрос",
          details: "Текст (prompt) обязателен",
        },
        { status: 400 },
      );
    }

    const yandex = await getYandexClient(request.headers);

    if (!yandex) {
      return NextResponse.json(
        {
          error: "Yandex Cloud API не настроен",
          details: "Проверьте API ключи в профиле.",
        },
        { status: 500 },
      );
    }

    const systemPrompt = buildSystemPrompt({ action });

    const modelName = "deepseek-v32/latest";

    const response = await yandex.client.responses.create({
      model: `gpt://${yandex.folderId}/${modelName}`,
      instructions: systemPrompt,
      input: prompt,
      temperature: 0.7,
      max_output_tokens: 2000,
      stream: false,
    });

    const generatedText = response.output_text || "";

    if (!generatedText) {
      return NextResponse.json(
        {
          error: "Пустой ответ от модели",
          details: "API вернул пустой текст",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      text: generatedText,
      provider: "yandex-cloud",
      model: "deepseek-v32",
    });
  } catch (error: unknown) {
    console.error("Ошибка генерации DeepSeek:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Внутренняя ошибка сервера",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
