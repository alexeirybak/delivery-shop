"use server";

import { ObjectId } from "mongodb";
import { getDB } from "../../utils/api-routes";

export async function acceptRules(userId: string) {
  try {
    const db = await getDB();

    await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          rulesAcceptedAt: new Date(),
        },
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Ошибка при сохранении ознакомления с правилами:", error);
    return { success: false, error: "Не удалось сохранить статус" };
  }
}

export async function checkRulesAccepted(userId: string): Promise<boolean> {
  try {
    const db = await getDB();

    const user = await db
      .collection("user")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { rulesAcceptedAt: 1 } },
      );

    return !!user?.rulesAcceptedAt;
  } catch (error) {
    console.error("Ошибка при проверке ознакомления с правилами:", error);
    return false;
  }
}
