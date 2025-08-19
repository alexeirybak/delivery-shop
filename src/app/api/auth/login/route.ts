import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

export async function POST(request: Request) {
  try {
    const { phoneNumber, password } = await request.json();

    const db = await getDB();

    const user = await db.collection("user").findOne({ phoneNumber });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 401 }
      );
    }

    const bcrypt = await import("bcrypt");
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Неверный пароль" }, { status: 401 });
    }

    const responseData = {
      success: true,
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        surname: user.surname,
        name: user.name,
        email: user.email,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
