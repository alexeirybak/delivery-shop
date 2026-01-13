import { NextRequest, NextResponse } from "next/server";

// Типы для запроса
type AspectRatio = "1:1" | "16:9" | "16:10" | "21:9";
type StyleType = "default" | "realistic" | "artistic" | "sketch" | "cartoon";

interface GenerationRequest {
  prompt: string;
  aspect_ratio?: AspectRatio;
  style?: StyleType;
}

// Типы для YandexART API - ПРАВИЛЬНАЯ СТРУКТУРА!
interface YandexArtGenerationRequest {
  modelUri: string;
  messages: Array<{ text: string; weight: number }>;
  generationOptions: {
    mimeType: "image/png";  // Обратите внимание: mimeType, а не mime_type!
    seed: number;
    aspectRatio?: {         // Вот оно! aspectRatio как объект
      widthRatio: number;
      heightRatio: number;
    };
    width?: number;         // Оставляем для обратной совместимости
    height?: number;        // Оставляем для обратной совместимости
  };
}

interface YandexArtResponse {
  id?: string;
  operationId?: string;
}

interface OperationStatus {
  done: boolean;
  response?: {
    image: string;
  };
  error?: string;
  createdAt?: string;
  modifiedAt?: string;
}

// POST - начать генерацию
export async function POST(request: NextRequest) {
  console.log("=== YandexART Image Generation ===");

  try {
    const body = await request.json();
    const { prompt, aspect_ratio = "1:1", style = "default" }: GenerationRequest = body;

    // Валидация
    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Описание должно содержать минимум 3 символа" },
        { status: 400 }
      );
    }

    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

    if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
      console.error("Missing env vars:", {
        hasApiKey: !!YANDEX_API_KEY,
        hasFolderId: !!YANDEX_FOLDER_ID,
      });
      return NextResponse.json(
        { error: "API ключи не настроены" },
        { status: 500 }
      );
    }

    // Парсим соотношения сторон
    let widthRatio = 1, heightRatio = 1;
    switch (aspect_ratio) {
      case "16:9":
        widthRatio = 16;
        heightRatio = 9;
        break;
      case "16:10":
        widthRatio = 16;
        heightRatio = 10;
        break;
      case "21:9":
        widthRatio = 21;
        heightRatio = 9;
        break;
    }

    console.log("Using aspect ratio:", aspect_ratio, "ratios:", widthRatio, ":", heightRatio);

    // Улучшаем промпт в зависимости от стиля
    let enhancedPrompt = prompt;
    const styleMap: Record<StyleType, string> = {
      realistic: "фотореалистично, высокое качество, детализированно, профессиональная фотография",
      artistic: "художественная живопись, шедевр, цифровое искусство, арт",
      sketch: "эскиз, рисунок, карандашный набросок, черно-белое",
      cartoon: "мультяшный стиль, анимация, диснеевский стиль",
      default: "",
    };

    if (style !== "default" && styleMap[style]) {
      enhancedPrompt = `${styleMap[style]}: ${prompt}`;
    }

    // ПРАВИЛЬНАЯ СТРУКТУРА согласно документации!
    const requestBody: YandexArtGenerationRequest = {
      modelUri: `art://${YANDEX_FOLDER_ID}/yandex-art/latest`,
      messages: [
        {
          text: enhancedPrompt,
          weight: 1,  // Важно: number, а не string!
        },
      ],
      generationOptions: {
        mimeType: "image/png",  // Правильное поле!
        seed: Math.floor(Math.random() * 1000000),
        aspectRatio: {          // Вот правильная структура!
          widthRatio: widthRatio,
          heightRatio: heightRatio,
        },
      },
    };

    console.log("Sending to YandexART (correct structure):", {
      modelUri: requestBody.modelUri,
      prompt: enhancedPrompt.substring(0, 100),
      aspectRatio: requestBody.generationOptions.aspectRatio,
      seed: requestBody.generationOptions.seed,
    });

    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${YANDEX_API_KEY}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseText = await response.text();
    console.log("Response status:", response.status);
    console.log("Response text length:", responseText.length);
    
    if (responseText.length > 0) {
      console.log("Response (first 500 chars):", responseText.substring(0, 500));
    } else {
      console.log("Response is empty!");
    }

    if (!response.ok) {
      // Если не сработало с aspectRatio, пробуем старый вариант
      console.log("Trying alternative format with width/height...");
      
      // Рассчитываем пиксели
      let width = 1024, height = 1024;
      switch (aspect_ratio) {
        case "16:9":
          width = 1024;
          height = 576;
          break;
        case "16:10":
          width = 1024;
          height = 640;
          break;
        case "21:9":
          width = 1024;
          height = 439;
          break;
      }

      const alternativeRequestBody = {
        modelUri: `art://${YANDEX_FOLDER_ID}/yandex-art/latest`,
        messages: [
          {
            text: enhancedPrompt,
            weight: 1,
          },
        ],
        generationOptions: {
          mime_type: "image/png",  // Старый вариант
          seed: Math.floor(Math.random() * 1000000),
          width: width,
          height: height,
        },
      };

      const altResponse = await fetch(
        "https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Api-Key ${YANDEX_API_KEY}`,
            Accept: "application/json",
          },
          body: JSON.stringify(alternativeRequestBody),
        }
      );

      const altResponseText = await altResponse.text();
      console.log("Alternative response status:", altResponse.status);
      
      if (!altResponse.ok) {
        return NextResponse.json(
          {
            error: "Ошибка API YandexART",
            details: `First attempt: ${response.status}, Second attempt: ${altResponse.status}`,
            firstResponse: responseText.substring(0, 500),
            secondResponse: altResponseText.substring(0, 500),
          },
          { status: altResponse.status }
        );
      }

      // Используем альтернативный ответ
      const altData: YandexArtResponse = JSON.parse(altResponseText);
      const operationId = altData.id || altData.operationId;

      if (!operationId) {
        return NextResponse.json(
          {
            error: "Не получен ID операции (альтернативный формат)",
            response: altData,
          },
          { status: 500 }
        );
      }

      console.log("Operation started with alternative format:", operationId);

      return NextResponse.json({
        success: true,
        operationId: operationId,
        status: "processing",
        message: "Генерация изображения начата (альтернативный формат)",
        style: style,
        aspect_ratio: aspect_ratio,
        api_format: "width/height_pixels",
      });
    }

    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        {
          error: "Пустой ответ от YandexART",
        },
        { status: 500 }
      );
    }

    let data: YandexArtResponse;
    try {
      data = JSON.parse(responseText) as YandexArtResponse;
    } catch (error) {
      console.error("JSON parse error:", error);
      return NextResponse.json(
        {
          error: "Невалидный JSON ответ от YandexART",
          rawResponse: responseText.substring(0, 500),
        },
        { status: 500 }
      );
    }

    const operationId = data.id || data.operationId;

    if (!operationId) {
      console.error("No operationId in response:", data);
      return NextResponse.json(
        {
          error: "Не получен ID операции",
          response: data,
        },
        { status: 500 }
      );
    }

    console.log("Operation started successfully with aspectRatio:", operationId);

    return NextResponse.json({
      success: true,
      operationId: operationId,
      status: "processing",
      message: "Генерация изображения начата",
      style: style,
      aspect_ratio: aspect_ratio,
      widthRatio: widthRatio,
      heightRatio: heightRatio,
      api_format: "aspectRatio_object",
    });
  } catch (error) {
    console.error("Generation error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Внутренняя ошибка", details: errorMessage },
      { status: 500 }
    );
  }
}

// GET - проверить статус (без изменений)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operationId = searchParams.get("operationId");

    if (!operationId) {
      return NextResponse.json(
        { error: "Не указан operationId" },
        { status: 400 }
      );
    }

    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    if (!YANDEX_API_KEY) {
      return NextResponse.json(
        { error: "API ключ не настроен" },
        { status: 500 }
      );
    }

    const statusUrl = `https://operation.api.cloud.yandex.net/operations/${operationId}`;

    console.log("Checking operation:", operationId);

    const response = await fetch(statusUrl, {
      headers: {
        Authorization: `Api-Key ${YANDEX_API_KEY}`,
        Accept: "application/json",
      },
    });

    const responseText = await response.text();
    console.log("Status response status:", response.status);
    console.log("Status response length:", responseText.length);

    if (!response.ok) {
      console.error("Status check failed:", responseText.substring(0, 200));
      return NextResponse.json(
        {
          error: "Ошибка проверки статуса",
          details: responseText.substring(0, 500),
          status: response.status,
        },
        { status: response.status }
      );
    }

    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        {
          error: "Пустой ответ при проверке статуса",
        },
        { status: 500 }
      );
    }

    let data: OperationStatus;
    try {
      data = JSON.parse(responseText) as OperationStatus;
    } catch (error) {
      console.error("Status JSON parse error:", error);
      return NextResponse.json(
        {
          error: "Невалидный JSON при проверке статуса",
          rawResponse: responseText.substring(0, 500),
        },
        { status: 500 }
      );
    }

    console.log("Operation status data:", {
      done: data.done,
      hasResponse: !!data.response,
      hasImage: !!(data.response?.image),
    });

    if (data.done) {
      if (data.response?.image) {
        const base64Image = data.response.image;
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;

        console.log("Image generated successfully");

        return NextResponse.json({
          success: true,
          done: true,
          status: "completed",
          imageUrl: imageUrl,
          operationId: operationId,
        });
      } else if (data.error) {
        console.error("Generation error in status:", data.error);
        return NextResponse.json({
          success: false,
          done: true,
          status: "failed",
          error: data.error,
          operationId: operationId,
        });
      } else {
        console.error("Unexpected response in status:", data);
        return NextResponse.json({
          success: false,
          done: true,
          status: "failed",
          error: "Неожиданный формат ответа от YandexART",
          operationId: operationId,
        });
      }
    }

    // Операция еще выполняется
    console.log("Operation still processing...");
    return NextResponse.json({
      success: true,
      done: false,
      status: "processing",
      operationId: operationId,
      message: "Генерация все еще выполняется",
    });
  } catch (error) {
    console.error("Status check error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Ошибка проверки",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}