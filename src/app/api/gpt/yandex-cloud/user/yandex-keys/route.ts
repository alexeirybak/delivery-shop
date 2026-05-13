import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import crypto from "crypto";
import { ObjectId } from "mongodb";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  console.error("ENCRYPTION_KEY не установлен");
}

const key = ENCRYPTION_KEY ? Buffer.from(ENCRYPTION_KEY, "hex") : null;

function encrypt(text: string): string {
  if (!key) throw new Error("Encryption key not configured");
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const user = await db.collection("user").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasKeys = !!(user.yandexApiKey && user.yandexFolderId);
    return NextResponse.json({ hasKeys });
  } catch (error) {
    console.error("Error checking Yandex keys:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const { apiKey, folderId } = await request.json();

    if (!apiKey || !folderId) {
      return NextResponse.json(
        { error: "API key and Folder ID are required" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const encryptedApiKey = encrypt(apiKey);
    const encryptedFolderId = encrypt(folderId);

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          yandexApiKey: encryptedApiKey,
          yandexFolderId: encryptedFolderId,
          yandexKeysUpdatedAt: new Date(),
          yandexKeysActive: true,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving Yandex keys:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to save API keys" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $unset: {
          yandexApiKey: "",
          yandexFolderId: "",
        },
        $set: {
          yandexKeysActive: false,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting Yandex keys:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to delete API keys" },
      { status: 500 },
    );
  }
}
