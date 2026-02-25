import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const db = await getDB();

  try {
    const { userId, cardNumber } = await request.json();

    if (!userId || !cardNumber) {
      return NextResponse.json(
        { error: "userId и cardNumber обязательны" },
        { status: 400 }
      );
    }

    let objectId;
    try {
      objectId = ObjectId.createFromHexString(userId);
    } catch {
      return NextResponse.json(
        { error: "Неверный формат userId" },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const user = await db.collection("user").findOne({ _id: objectId });
    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // 1. Ищем карту в коллекции cards
    const card = await db.collection("cards").findOne({ cardNumber });
    if (!card) {
      return NextResponse.json(
        { error: "Карта с таким номером не найдена в системе" },
        { status: 404 }
      );
    }

    // 2. Проверяем, не привязана ли карта к другому пользователю
    const existingUserWithCard = await db.collection("user").findOne({ 
      card: cardNumber 
    });

    if (existingUserWithCard && existingUserWithCard._id.toString() !== userId) {
      return NextResponse.json(
        { error: "Эта карта уже привязана к другому пользователю" },
        { status: 400 }
      );
    }

    // 3. Если карта уже привязана к этому же пользователю
    if (existingUserWithCard && existingUserWithCard._id.toString() === userId) {
      return NextResponse.json({
        success: true,
        message: "Карта уже привязана к вашему аккаунту",
        card: cardNumber,
      });
    }

    // 4. Привязываем карту к пользователю И АКТИВИРУЕМ её
    const [updateUser, updateCard] = await Promise.all([
      // Обновляем пользователя
      db.collection("user").updateOne(
        { _id: objectId },
        { 
          $set: { 
            card: cardNumber,
            hasCard: true,
            updatedAt: new Date()
          } 
        }
      ),
      // Активируем карту
      db.collection("cards").updateOne(
        { cardNumber },
        { 
          $set: { 
            isActive: true,
            activatedAt: new Date()
          } 
        }
      )
    ]);

    if (updateUser.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Не удалось обновить данные пользователя" },
        { status: 500 }
      );
    }

    if (updateCard.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Не удалось активировать карту" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Карта успешно привязана и активирована",
      card: cardNumber,
    });
  } catch (error) {
    console.error("Ошибка при обновлении карты:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}