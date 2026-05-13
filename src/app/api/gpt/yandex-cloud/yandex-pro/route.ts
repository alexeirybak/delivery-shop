import { NextRequest, NextResponse } from "next/server";
import { getOptimalTemperature } from "@/app/api/utils/getOptimalTemperature";
import { getMaxTokens } from "@/app/api/utils/getMaxTokens";
import { getYandexClient } from "@/lib/yandex-client";
import { buildSystemPrompt } from "@/app/(user-part)/prompts/prompt-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      action,
      stream = true,
      isFullArticle = false,
      mode,
      generationSettings,
    } = body;

    console.log("📝 YandexPro запрос!:", {
      prompt: prompt.substring(0, 100),
      action,
      stream,
      isFullArticle,
      mode,
    });

    if (!prompt) {
      return NextResponse.json(
        { error: "Неверный запрос", details: "Текст (prompt) обязателен" },
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

    const finalTemperature = getOptimalTemperature(
      action || mode || "chat_education",
    );
    const finalMaxTokens = getMaxTokens(action || mode || "chat_education");

    const systemPrompt = buildSystemPrompt({
      action,
      isFullArticle,
      mode,
      generationSettings,
      prompt,
    });

    console.log(systemPrompt);

    const modelName = "yandexgpt-5.1/latest";

    if (stream) {
      const response = await yandex.client.responses.create({
        model: `gpt://${yandex.folderId}/${modelName}`,
        instructions: systemPrompt,
        input: prompt,
        temperature: finalTemperature,
        max_output_tokens: finalMaxTokens,
        stream: true,
      });

      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              if (chunk.type === "error") {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ error: chunk.message || "Ошибка Yandex API" })}\n\n`,
                  ),
                );
                continue;
              }

              if (chunk.type === "response.output_text.delta") {
                const delta = chunk.delta;
                if (delta) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ text: delta })}\n\n`,
                    ),
                  );
                }
              } else if (chunk.type === "response.output_text.done") {
                const text = chunk.text;
                if (text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text: "" })}\n\n`),
                  );
                }
              }
            }
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          } catch (e) {
            console.error("Stream error:", e);
            controller.error(e);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const response = await yandex.client.responses.create({
      model: `gpt://${yandex.folderId}/${modelName}`,
      instructions: systemPrompt,
      input: prompt,
      temperature: finalTemperature,
      max_output_tokens: finalMaxTokens,
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
      model: "yandexgpt-5-pro",
      isFullArticle,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Ошибка генерации:", error);
    return NextResponse.json(
      { error: "Ошибка генерации статьи", details: errorMessage },
      { status: 500 },
    );
  }
}
