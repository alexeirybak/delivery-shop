import { getDB } from "../../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerUserId } from "../../../../../utils/getServerUserId";

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const requestData = await request.json();

    const { 
      orderId, 
      usedBonuses, 
      earnedBonuses, 
      purchasedProductIds 
    } = requestData;

    const userId = await getServerUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Пользователь не авторизован" },
        { status: 401 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { message: "ID заказа обязателен" },
        { status: 400 }
      );
    }

    let userObjectId;
    let orderObjectId;
    
    try {
      userObjectId = ObjectId.createFromHexString(userId);
      orderObjectId = ObjectId.createFromHexString(orderId);
    } catch {
      console.error("Неправильный формат ID:", { userId, orderId });
      return NextResponse.json(
        { message: "Неверный формат ID" },
        { status: 400 }
      );
    }

    const [order, user] = await Promise.all([
      db.collection("orders").findOne({ _id: orderObjectId }),
      db.collection("user").findOne({ _id: userObjectId })
    ]);

    if (!order) {
      return NextResponse.json(
        { message: "Заказ не найден" },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    if (usedBonuses !== undefined || earnedBonuses !== undefined) {
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

      let updatedPurchases = Array.isArray(user.purchases) ? user.purchases : [];
      
      if (purchasedProductIds && purchasedProductIds.length > 0) {
        const numericPurchasedIds = purchasedProductIds.map((id: string) => Number(id));
        const uniqueNewIds = numericPurchasedIds.filter(
          (id: number, index: number, array: number[]) => array.indexOf(id) === index
        );

        const allPurchases = [...updatedPurchases, ...uniqueNewIds];
        updatedPurchases = allPurchases.filter(
          (id: number, index: number, array: number[]) => array.indexOf(id) === index
        );
      }

      await db.collection("user").updateOne(
        { _id: userObjectId },
        {
          $set: {
            bonusesCount: newBonusesCount,
            purchases: updatedPurchases,
            updatedAt: new Date(),
          },
        }
      );
    }

    for (const item of order.items) {
      const productIdNumber = parseInt(item.productId);
      await db.collection("products").updateOne(
        { id: productIdNumber },
        {
          $inc: { quantity: -item.quantity },
          $set: { updatedAt: new Date() },
        }
      );
    }

    await db.collection("orders").updateOne(
      { _id: orderObjectId },
      {
        $set: {
          status: "confirmed",
          paymentStatus: "paid",
          paidAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Оплата подтверждена, товары списаны и данные пользователя обновлены",
    });

  } catch (error) {
    console.error("Ошибка подтверждения оплаты:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}