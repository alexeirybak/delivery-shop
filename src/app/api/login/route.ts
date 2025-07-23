import { NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    const db = await getDB();

    const user = await db.collection("users").findOne({ phone });

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
        phone: user.phone,
        surname: user.surname,
        firstName: user.firstName,
        email: user.email,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
