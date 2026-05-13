import { NextRequest, NextResponse } from "next/server";
import { getOptimalTemperature } from "@/app/api/utils/getOptimalTemperature";
import { getMaxTokens } from "@/app/api/utils/getMaxTokens";
import { buildSystemPrompt } from "@/app/(user-part)/prompts/prompt-utils";

// Функция для имитации задержки
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Функция для генерации имитированного ответа
function generateMockResponse(
  prompt: string,
  systemPrompt: string,
  mode: string,
): string {
  // Базовая заглушка
  let mockText = `[ИМИТАЦИЯ ОТВЕТА МОДЕЛИ]\n\n`;
  mockText += `Режим: ${mode}\n`;
  mockText += `Системный промпт: ${systemPrompt.substring(0, 200)}...\n\n`;
  mockText += `Пользовательский запрос: ${prompt}\n\n`;
  mockText += `--- СГЕНЕРИРОВАННЫЙ КОНТЕНТ ---\n\n`;

  // Более осмысленная заглушка в зависимости от режима
  if (
    mode === "textbooks" ||
    mode === "test" ||
    mode === "coursework" ||
    mode === "report" ||
    mode === "thesis"
  ) {
    mockText += `# Содержание\n\n`;
    mockText += `## Глава 1. Введение\n\n`;
    mockText += `Это имитация сгенерированного контента для ${mode}.\n\n`;
    mockText += `## Глава 2. Основная часть\n\n`;
    mockText += `Здесь будет сгенерированный текст на основе ваших настроек.\n\n`;
    mockText += `## Глава 3. Заключение\n\n`;
    mockText += `Итоги и выводы.\n\n`;
  } else if (mode === "essay") {
    mockText += `# Введение\n\n`;
    mockText += `Это имитация эссе на заданную тему.\n\n`;
    mockText += `# Основная часть\n\n`;
    mockText += `Здесь будут аргументы и рассуждения.\n\n`;
    mockText += `# Заключение\n\n`;
    mockText += `Выводы по теме.\n\n`;
  } else {
    mockText += `Это имитация ответа модели в режиме "${mode}".\n\n`;
    mockText += `Ваш запрос: "${prompt}"\n\n`;
    mockText += `В реальном режиме здесь будет сгенерирован полноценный ответ на основе системного промпта.\n`;
  }

  return mockText;
}

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

    console.log(`[МОК API] prompt:`, prompt);
    console.log(`[МОК API] mode:`, mode);
    console.log(`[МОК API] generationSettings:`, generationSettings);

    if (!prompt) {
      return NextResponse.json(
        {
          error: "Неверный запрос",
          details: "Текст (prompt) обязателен",
        },
        { status: 400 },
      );
    }

    // Получаем параметры (для совместимости с оригинальным API)
    const finalTemperature = getOptimalTemperature(mode || "chat_education");
    const finalMaxTokens = getMaxTokens(mode || "chat_education");

    console.log(
      `[МОК API] temperature: ${finalTemperature}, maxTokens: ${finalMaxTokens}`,
    );

    // Строим системный промпт (полностью сохраняем логику)
    const systemPrompt = buildSystemPrompt({
      action,
      isFullArticle,
      mode,
      generationSettings,
    });

    console.log(
      `[МОК API] systemPrompt (первые 500 символов):`,
      systemPrompt.substring(0, 50000),
    );

    // Имитируем потоковый ответ
    if (stream) {
      const mockResponse = generateMockResponse(prompt, systemPrompt, mode);

      // Разбиваем ответ на части для имитации потока
      const chunks = mockResponse.match(/.{1,20}/g) || [mockResponse];

      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for (let i = 0; i < chunks.length; i++) {
              const chunk = chunks[i];
              // Имитируем задержку между чанками
              await delay(50);

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`),
              );
            }

            // Отправляем финальный сигнал
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: "" })}\n\n`),
            );
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          } catch (e) {
            console.error("Мок stream error:", e);
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

    // Имитируем не-потоковый ответ
    const mockResponse = generateMockResponse(prompt, systemPrompt, mode);

    // Имитируем задержку как у реальной модели
    await delay(500);

    return NextResponse.json({
      text: mockResponse,
      provider: "mock",
      model: "mock-model",
      isFullArticle,
      _mock: true,
      _mode: mode,
    });
  } catch (error: unknown) {
    console.error("Ошибка в мок API:", error);

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
