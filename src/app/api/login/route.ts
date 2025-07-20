import { NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";

export async function POST(req: Request) {
  try {
    // 1. Получаем данные из запроса
    const { phone, password } = await req.json();
    const db = await getDB();

    // 2. Ищем пользователя в базе данных
    const user = await db.collection("users").findOne({ phone });
    
    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 401 }
      );
    }

    // 3. Проверяем пароль
    const bcrypt = await import("bcryptjs");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Неверный пароль" },
        { status: 401 }
      );
    }

    // 4. Формируем ответ без пароля
    const responseData = {
      success: true,
      user: {
        _id: user._id,
        phone: user.phone,
        surname: user.surname,
        firstName: user.firstName,
        email: user.email,
        // Добавьте другие необходимые поля, кроме password
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Ошибка входа:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}