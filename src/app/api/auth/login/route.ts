import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { message: "Требуется телефон и пароль" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const user = await db.collection("user").findOne({ phoneNumber: phone });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Неверный пароль" }, { status: 401 });
    }

    // Успешная аутентификация
    const responseData = {
      success: true,
      user: {
        _id: user._id,
        phone: user.phoneNumber,
        surname: user.surname,
        name: user.name,
        email: user.email,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
