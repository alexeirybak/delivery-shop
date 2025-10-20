import { getDB } from "../../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerUserId } from "../../../../../utils/getServerUserId";

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const requestData = await request.json();

    const { usedBonuses, earnedBonuses, purchasedProductIds } = requestData;
    const userId = await getServerUserId();

    console.log(`ID пользователя -1`, userId);

    if (!userId) {
      return NextResponse.json(
        { message: "Пользователь не авторизован" },
        { status: 401 }
      );
    }

    let userObjectId;
    try {
      userObjectId = ObjectId.createFromHexString(userId);
      console.log(`ID пользователя - 2`, userObjectId);
    } catch {
      console.error("Invalid user ID format:", userId);
      return NextResponse.json(
        { message: "Неверный формат ID пользователя" },
        { status: 400 }
      );
    }

    const user = await db.collection("user").findOne({
      _id: userObjectId,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const currentBonuses = user.bonusesCount || 0;
    const usedBonusesNum = Number(usedBonuses) || 0;
    const earnedBonusesNum = Number(earnedBonuses) || 0;

    if (usedBonusesNum > currentBonuses) {
      return NextResponse.json(
        {
          message: "Недостаточно бонусов",
          availableBonuses: currentBonuses,
          requiredBonuses: usedBonusesNum,
        },
        { status: 400 }
      );
    }

    const newBonusesCount = currentBonuses - usedBonusesNum + earnedBonusesNum;
    const currentPurchases = Array.isArray(user.purchases)
      ? user.purchases
      : [];

    const numericPurchasedIds = (purchasedProductIds || []).map((id: string) =>
      Number(id)
    );
    const updatedPurchases = [...currentPurchases, ...numericPurchasedIds];

    const updateResult = await db.collection("user").updateOne(
      { _id: userObjectId },
      {
        $set: {
          bonusesCount: newBonusesCount,
          purchases: updatedPurchases,
          cart: [],
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Данные не были обновлены" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Пользователь успешно обновлен",
      updatedFields: {
        bonusesDeducted: usedBonusesNum,
        bonusesAdded: earnedBonusesNum,
        newBonusesCount,
        productsAdded: numericPurchasedIds.length,
        totalPurchases: updatedPurchases.length,
        cartCleared: true,
      },
    });
  } catch (error) {
    console.error("Ошибка обновления данных пользователя:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
