"use server";

import { ObjectId } from "mongodb";
import { getDB } from "../../utils/api-routes";
import { getDayWord } from "@/app/(admin)/administrator/(cms)/cms/comments/utils/getDayWord";

export async function banUser(userId: string, banDays: number | null) {
  try {
    if (!userId) {
      return { 
        success: false, 
        error: "ID пользователя не указан" 
      };
    }

    const db = await getDB();

    let banUntil = null;
    if (banDays !== null) {
      banUntil = new Date();
      banUntil.setDate(banUntil.getDate() + banDays);
    }

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          bannedUntil: banUntil,
          bannedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return { 
        success: false, 
        error: "Пользователь не найден" 
      };
    }

    return { 
      success: true,
      bannedUntil: banUntil?.toISOString() || null,
      message: banDays === null 
        ? "Пользователь забанен навсегда" 
        : `Пользователь забанен на ${banDays} ${getDayWord(banDays)}`
    };
  } catch (error) {
    console.error("Ошибка бана пользователя:", error);
    return { 
      success: false, 
      error: "Внутренняя ошибка сервера" 
    };
  }
}

export async function unbanUser(userId: string) {
  try {
    if (!userId) {
      return { 
        success: false, 
        error: "ID пользователя не указан" 
      };
    }

    const db = await getDB();

    const result = await db.collection("user").updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      {
        $unset: {
          bannedUntil: "",
          bannedAt: "",
        },
      }
    );

    if (result.matchedCount === 0) {
      return { 
        success: false, 
        error: "Пользователь не найден" 
      };
    }

    return { 
      success: true,
      message: "Пользователь разблокирован"
    };
  } catch (error) {
    console.error("Ошибка разблокировки пользователя:", error);
    return { 
      success: false, 
      error: "Внутренняя ошибка сервера" 
    };
  }
}

export async function checkBanStatus(userId: string) {
  try {
    if (!userId) {
      return { 
        success: false, 
        error: "ID пользователя не указан" 
      };
    }

    const db = await getDB();

    const user = await db.collection("user").findOne(
      { _id: new ObjectId(userId) },
      { projection: { bannedUntil: 1 } }
    );

    if (!user) {
      return { 
        success: false, 
        error: "Пользователь не найден" 
      };
    }

    const now = new Date();
    const isBanned = user.bannedUntil === null || new Date(user.bannedUntil) > now;

    return { 
      success: true,
      isBanned,
      bannedUntil: user.bannedUntil?.toISOString() || null 
    };
  } catch (error) {
    console.error("Ошибка проверки статуса бана:", error);
    return { 
      success: false, 
      error: "Внутренняя ошибка сервера" 
    };
  }
}