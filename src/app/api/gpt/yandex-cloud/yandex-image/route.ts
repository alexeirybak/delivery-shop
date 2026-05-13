import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { getYandexClient } from "@/lib/yandex-client";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import {
  ArtGenerationRequest,
  ArtResponse,
  GenerationRequest,
  StyleType,
} from "@/app/(user-part)/user-dashboard/(workbook)/records/types";

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

    const yandex = await getYandexClient(request.headers);

    if (!yandex || !yandex.client || !yandex.folderId) {
      return NextResponse.json(
        {
          error:
            "API ключи не настроены. Добавьте API ключ Yandex Cloud в профиле.",
        },
        { status: 500 },
      );
    }

    const apiKey = yandex.client.apiKey;

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

    const requestBody: ArtGenerationRequest = {
      modelUri: `art://${yandex.folderId}/yandex-art/latest`,
      messages: [{ text: enhancedPrompt, weight: 1 }],
      generationOptions: {
        mimeType: "image/png",
        seed: Math.floor(Math.random() * 1000000),
        aspectRatio: { widthRatio, heightRatio },
      },
    };

    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${apiKey}`,
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

    let data: ArtResponse;
    try {
      data = JSON.parse(responseText) as ArtResponse;
    } catch {
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
      return NextResponse.json(
        { error: "Не получен ID операции", response: data },
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

    let userId: string;
    try {
      userId = await getAuthenticatedUserId(request.headers);
    } catch {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const yandex = await getYandexClient(request.headers);

    if (!yandex || !yandex.client) {
      return NextResponse.json(
        { error: "API ключ не настроен" },
        { status: 500 },
      );
    }

    const apiKey = yandex.client.apiKey;

    const statusUrl = `https://operation.api.cloud.yandex.net/operations/${operationId}`;

    const response = await fetch(statusUrl, {
      headers: {
        Authorization: `Api-Key ${apiKey}`,
        Accept: "application/json",
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Ошибка проверки статуса",
          details: responseText.substring(0, 500),
          status: response.status,
        },
        { status: response.status },
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          error: "Невалидный JSON при проверке статуса",
          rawResponse: responseText.substring(0, 500),
        },
        { status: 500 },
      );
    }

    if (data.done && data.response?.image) {
      const base64Image = data.response.image;
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);

      // ИЗМЕНЕНО: добавляем префикс temp_ и сохраняем во временную папку
      const tempFileName = `temp_${timestamp}_${randomString}.png`;

      const optimizedBuffer = await sharp(buffer)
        .resize(2048, 2048, { fit: "inside", withoutEnlargement: false })
        .png({ quality: 90, compressionLevel: 8 })
        .toBuffer();

      // Сохраняем во ВРЕМЕННУЮ папку пользователя
      const tempUploadDir = path.join(process.cwd(), "uploads", "temp", userId);
      await fs.mkdir(tempUploadDir, { recursive: true });
      await fs.writeFile(
        path.join(tempUploadDir, tempFileName),
        optimizedBuffer,
      );

      // Возвращаем ВРЕМЕННЫЙ URL
      const tempUrl = `/api/uploads/temp/${userId}/${tempFileName}`;

      return NextResponse.json({
        success: true,
        done: true,
        status: "success",
        imageUrl: tempUrl, // ← временный URL
        fileName: tempFileName,
        fileSize: optimizedBuffer.length,
        format: "png",
        operationId: operationId,
      });
    }

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
      { error: "Ошибка проверки", details: errorMessage },
      { status: 500 },
    );
  }
}
