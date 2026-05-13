import OpenAI from "openai";
import { getDB } from "./api-routes";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

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

interface YandexClientResult {
  client: OpenAI;
  folderId: string;
  source: "user" | "system";
}

export async function getYandexClient(
  headers: Headers,
): Promise<YandexClientResult | null> {
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

        const client = new OpenAI({
          apiKey: apiKey,
          baseURL: "https://ai.api.cloud.yandex.net/v1",
          defaultHeaders: {
            "OpenAI-Project": folderId,
          },
        });

        return { client, folderId, source: "user" };
      } catch (error) {
        console.error("Failed to decrypt user keys:", error);
      }
    }
  } catch (error) {
    console.error("Failed to get user keys:", error);
  }

  const systemApiKey = process.env.YANDEX_API_KEY;
  const systemFolderId = process.env.YANDEX_FOLDER_ID;

  if (systemApiKey && systemFolderId) {
    const client = new OpenAI({
      apiKey: systemApiKey,
      baseURL: "https://ai.api.cloud.yandex.net/v1",
      defaultHeaders: {
        "OpenAI-Project": systemFolderId,
      },
    });

    return { client, folderId: systemFolderId, source: "system" };
  }

  return null;
}
