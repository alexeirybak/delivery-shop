import {
  GenerationRequest,
  StyleType,
  YandexArtGenerationRequest,
  YandexArtResponse,
} from "@/app/(admin)/administrator/(cms)/cms/articles/types";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      aspect_ratio = "1:1",
      style = "default",
    }: GenerationRequest = body;

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Описание должно содержать минимум 3 символа" },
        { status: 400 },
      );
    }

    if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
      console.error("Отсутствуют API-ключи:", {
        hasApiKey: !!YANDEX_API_KEY,
        hasFolderId: !!YANDEX_FOLDER_ID,
      });
      return NextResponse.json(
        { error: "API ключи не настроены" },
        { status: 500 },
      );
    }

    let widthRatio = 1,
      heightRatio = 1;
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

    let enhancedPrompt = prompt;
    const styleMap: Record<StyleType, string> = {
      realistic:
        "фотореалистично, высокое качество, детализированно, профессиональная фотография",
      artistic: "художественная живопись, шедевр, цифровое искусство, арт",
      sketch: "эскиз, рисунок, карандашный набросок, черно-белое",
      cartoon: "мультяшный стиль, анимация, диснеевский стиль",
      default: "",
    };

    if (style !== "default" && styleMap[style]) {
      enhancedPrompt = `${styleMap[style]}: ${prompt}`;
    }

    const requestBody: YandexArtGenerationRequest = {
      modelUri: `art://${YANDEX_FOLDER_ID}/yandex-art/latest`,
      messages: [
        {
          text: enhancedPrompt,
          weight: 1,
        },
      ],
      generationOptions: {
        mimeType: "image/png",
        seed: Math.floor(Math.random() * 1000000),
        aspectRatio: {
          widthRatio: widthRatio,
          heightRatio: heightRatio,
        },
      },
    };

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
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Ошибка API YandexART",
          details: `Status: ${response.status}`,
          response: responseText.substring(0, 500),
        },
        { status: response.status },
      );
    }

    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        {
          error: "Пустой ответ от YandexART",
        },
        { status: 500 },
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
        { status: 500 },
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
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      operationId: operationId,
      status: "loading",
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
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operationId = searchParams.get("operationId");

    if (!operationId) {
      return NextResponse.json(
        { error: "Не указан operationId" },
        { status: 400 },
      );
    }

    if (!YANDEX_API_KEY) {
      return NextResponse.json(
        { error: "API ключ не настроен" },
        { status: 500 },
      );
    }

    const statusUrl = `https://operation.api.cloud.yandex.net/operations/${operationId}`;

    const response = await fetch(statusUrl, {
      headers: {
        Authorization: `Api-Key ${YANDEX_API_KEY}`,
        Accept: "application/json",
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "Не получилось установить статус:",
        responseText.substring(0, 200),
      );
      return NextResponse.json(
        {
          error: "Ошибка проверки статуса",
          details: responseText.substring(0, 500),
          status: response.status,
        },
        { status: response.status },
      );
    }

    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        {
          error: "Пустой ответ при проверке статуса",
        },
        { status: 500 },
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Status JSON parse error:", error);
      return NextResponse.json(
        {
          error: "Невалидный JSON при проверке статуса",
          rawResponse: responseText.substring(0, 500),
        },
        { status: 500 },
      );
    }

    console.log("Checking status for operationId:", operationId);
    console.log("Response from Yandex:", {
      done: data.done,
      hasImage: !!data.response?.image,
      operationId: data.id || data.operationId,
    });

    if (data.done) {
      if (data.response?.image) {
        // Сохраняем изображение как файл
        const base64Image = data.response.image;
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Создаем уникальное имя файла
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);

        // Используем PNG как YandexART по умолчанию
        const originalExtension = "png";
        const cleanName = "yandex_art";
        const fileName = `${cleanName}_${timestamp}_${randomString}.${originalExtension}`;

        // ОПТИМИЗИРУЕМ ЧЕРЕЗ SHARP
        let optimizedBuffer: Buffer;

        if (originalExtension === "png") {
          // Для AI-изображений делаем больше и лучше качество
          optimizedBuffer = await sharp(buffer)
            .resize(2048, 2048, {
              fit: "inside",
              withoutEnlargement: false,
            })
            .png({
              quality: 90,
              compressionLevel: 8,
            })
            .toBuffer();
        } else {
          // Для JPG
          optimizedBuffer = await sharp(buffer)
            .resize(2048, 2048, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({
              quality: 90,
              mozjpeg: true,
            })
            .toBuffer();
        }

        // Сохраняем в указанную папку
        const publicDir = path.join(
          process.cwd(),
          "public",
          "uploads",
          "articles",
          "yandex-art",
        );
        await fs.mkdir(publicDir, { recursive: true });

        const filePath = path.join(publicDir, fileName);
        await fs.writeFile(filePath, optimizedBuffer);

        console.log("File saved:", fileName);

        // Публичный URL для использования на фронтенде
        const publicUrl = `/uploads/articles/yandex-art/${fileName}`;

        return NextResponse.json({
          success: true,
          done: true,
          status: "success",
          imageUrl: publicUrl,
          fileName: fileName,
          fileSize: optimizedBuffer.length,
          format: originalExtension,
          operationId: operationId,
        });
      } else if (data.error) {
        console.error("Ошибка генерации статуса:", data.error);
        return NextResponse.json({
          success: false,
          done: true,
          status: "failed",
          error: data.error,
          operationId: operationId,
        });
      } else {
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
    return NextResponse.json({
      success: true,
      done: false,
      status: "loading",
      operationId: operationId,
      message: "Генерация все еще выполняется",
    });
  } catch (error) {
    console.error("Ошибка проверки статуса:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Ошибка проверки",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
