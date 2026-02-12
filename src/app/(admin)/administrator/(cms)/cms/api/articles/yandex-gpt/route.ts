import { NextRequest, NextResponse } from "next/server";
import { YandexGPTRequest, YandexGPTResponse } from "../../../articles/types";
import { getSystemPrompt } from "../../../articles/utils/systemPrompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, action = "improve" } = body as YandexGPTRequest;

    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

    if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
      return NextResponse.json(
        {
          error: "YandexGPT API не настроен",
          details: "Проверьте YANDEX_API_KEY и YANDEX_FOLDER_ID в .env",
        },
        { status: 500 },
      );
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          error: "Неверный запрос",
          details: "Текст (prompt) обязателен",
        },
        { status: 400 },
      );
    }

    // Получаем системный промпт из отдельного файла
    const systemPrompt = getSystemPrompt(action);

    const apiUrl =
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Api-Key ${YANDEX_API_KEY}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt`,
        completionOptions: {
          stream: false,
          temperature: 0.7,
          maxTokens: 2000,
        },
        messages: [
          {
            role: "system",
            text: systemPrompt,
          },
          {
            role: "user",
            text: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("YandexGPT API error:", response.status, errorText);

      let errorMessage = `YandexGPT API error: ${response.status}`;
      try {
        const errorData: YandexGPTResponse = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        console.error(
          "Failed to parse error JSON:",
          errorText.substring(0, 200),
        );
      }

      return NextResponse.json(
        {
          error: "Ошибка YandexGPT API",
          details: errorMessage,
          status: response.status,
        },
        { status: response.status },
      );
    }

    const data: YandexGPTResponse = await response.json();

    const generatedText = data.result?.alternatives?.[0]?.message?.text || "";

    if (!generatedText) {
      return NextResponse.json(
        {
          error: "Пустой ответ от YandexGPT",
          details: "API вернул пустой текст",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      text: generatedText,
      provider: "yandex-gpt",
      model: "yandexgpt",
    });
  } catch (error: unknown) {
    console.error("Ошибка генерации со стороны YandexGPT:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Внутренняя ошибка сервера",
        details: errorMessage,
        suggestion:
          "Проверьте сетевые настройки и доступ к api.cloud.yandex.net",
      },
      { status: 500 },
    );
  }
}