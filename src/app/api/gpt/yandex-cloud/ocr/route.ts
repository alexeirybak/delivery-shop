import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { ObjectId } from "mongodb";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const key = ENCRYPTION_KEY ? Buffer.from(ENCRYPTION_KEY, "hex") : null;

function decrypt(text: string): string {
  if (!key) throw new Error("Encryption key not configured");
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift()!, "hex");
  const encryptedText = parts.join(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

interface OCRRequest {
  images: Array<{
    base64: string;
    mimeType: string;
  }>;
}

interface YandexKeys {
  apiKey: string;
  folderId: string;
  source: "user" | "system";
}

async function getYandexKeys(headers: Headers): Promise<YandexKeys | null> {
  try {
    const userId = await getAuthenticatedUserId(headers);
    const db = await getDB();
    const user = await db.collection("user").findOne({
      _id: new ObjectId(userId),
    });

    if (user?.yandexApiKey && user?.yandexFolderId) {
      try {
        const apiKey = decrypt(user.yandexApiKey);
        const folderId = decrypt(user.yandexFolderId);

        return { apiKey, folderId, source: "user" };
      } catch (error) {
        console.error(
          "[OCR] Ошибка расшифровки пользовательских ключей:",
          error,
        );
      }
    }
  } catch (error) {
    console.error("[OCR] Ошибка получения пользовательских ключей:", error);
  }

  const systemApiKey = process.env.YANDEX_API_KEY;
  const systemFolderId = process.env.YANDEX_FOLDER_ID;

  if (systemApiKey && systemFolderId) {
    return { apiKey: systemApiKey, folderId: systemFolderId, source: "system" };
  }

  console.error("[OCR] Нет доступных API ключей!");
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images } = body as OCRRequest;

    const keys = await getYandexKeys(request.headers);

    if (!keys) {
      return NextResponse.json(
        {
          error: "Yandex Cloud API не настроен",
          details:
            "Нет доступных API ключей. Добавьте свои ключи в профиле или настройте системные.",
        },
        { status: 500 },
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "Изображения не предоставлены" },
        { status: 400 },
      );
    }

    const recognizedTexts: string[] = [];

    for (const image of images) {
      const ocrRequestBody = {
        mimeType: image.mimeType || "image/jpeg",
        languageCodes: ["ru", "en"],
        model: "page",
        content: image.base64,
      };

      const response = await fetch(
        "https://ocr.api.cloud.yandex.net/ocr/v1/recognizeText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keys.apiKey}`,
            "x-folder-id": keys.folderId,
          },
          body: JSON.stringify(ocrRequestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`OCR request failed: ${response.statusText}`);
      }

      const result = await response.json();

      const fullText = result.result?.textAnnotation?.fullText || "";
      recognizedTexts.push(fullText);
    }

    return NextResponse.json({
      text: recognizedTexts.join("\n\n"),
      success: true,
      source: keys.source,
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json(
      {
        error: "Ошибка распознавания",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
