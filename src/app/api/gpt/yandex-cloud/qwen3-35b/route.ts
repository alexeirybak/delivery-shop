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
      stream = true,
      mode,
      generationSettings,
      images,
    } = body;

    if (!prompt && (!images || images.length === 0)) {
      return NextResponse.json(
        {
          error: "Неверный запрос",
          details: "Нужен текст или изображение",
        },
        { status: 400 },
      );
    }

    const yandexResult = await getYandexClient(request.headers);

    if (!yandexResult) {
      return NextResponse.json(
        {
          error: "Yandex Cloud API не настроен",
        },
        { status: 500 },
      );
    }

    const { client, folderId } = yandexResult;

    const finalTemperature = getOptimalTemperature(mode || "chat_education");
    const finalMaxTokens = getMaxTokens(mode || "chat_education");

    const systemPrompt = buildSystemPrompt({
      mode,
      generationSettings,
    });

    const modelName = "qwen3.6-35b-a3b/latest";

    const input = [
      {
        role: "user" as const,
        content: [
          ...(images && images.length > 0
            ? images.map((img: { base64: string }) => ({
                type: "input_image" as const,
                image_url: img.base64.startsWith("data:")
                  ? img.base64
                  : `data:image/png;base64,${img.base64}`,
              }))
            : []),
          ...(prompt
            ? [
                {
                  type: "input_text" as const,
                  text: prompt,
                },
              ]
            : []),
        ],
      },
    ];

    if (stream) {
      const response = await client.responses.create({
        model: `gpt://${folderId}/${modelName}`,
        instructions: systemPrompt,
        input,
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
                    `data: ${JSON.stringify({
                      error: chunk.message || "Ошибка API",
                    })}\n\n`,
                  ),
                );
                continue;
              }

              if (chunk.type === "response.output_text.delta") {
                if (chunk.delta) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        text: chunk.delta,
                      })}\n\n`,
                    ),
                  );
                }
              }

              if (chunk.type === "response.completed") {
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              }
            }
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

    const response = await client.responses.create({
      model: `gpt://${folderId}/${modelName}`,
      instructions: systemPrompt,
      input,
      temperature: finalTemperature,
      max_output_tokens: finalMaxTokens,
    });

    const generatedText = response.output_text;

    if (!generatedText) {
      return NextResponse.json(
        {
          error: "Пустой ответ модели",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      text: generatedText,
      provider: "yandex-cloud",
      model: modelName,
    });
  } catch (error: unknown) {
    console.error("Ошибка генерации:", error);

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