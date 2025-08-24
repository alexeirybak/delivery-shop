// Импорт NextResponse для создания HTTP ответов
import { NextResponse } from "next/server";
// Импорт функции getDB для подключения к MongoDB
import { getDB } from "../../../../../utils/api-routes";
// Импорт ObjectId для работы с MongoDB ObjectID
import { ObjectId } from "mongodb";
// Импорт auth клиента Better-Auth
import { auth } from "@/lib/auth";

// Экспорт асинхронной функции GET для обработки запросов
export async function GET(request: Request) {
  try {
    // 1. Сначала пробуем через Better-Auth (для email пользователей)
    try {
      // Получаем сессию через Better-Auth API
      const session = await auth.api.getSession({
        headers: request.headers, // Передаем заголовки запроса
      });

      // Если сессия найдена
      if (session) {
        // Подключаемся к базе данных
        const db = await getDB();
        // Ищем пользователя по ID из сессии Better-Auth
        const user = await db.collection("user").findOne({
          _id: new ObjectId(session.user.id), // Конвертируем string ID в ObjectId
        });

        // Если пользователь найден, возвращаем его данные
        if (user) {
          return NextResponse.json({
            id: user._id.toString(), // Конвертируем ObjectId в string
            name: user.name,
            surname: user.surname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            emailVerified: user.emailVerified,
            phoneNumberVerified: user.phoneNumberVerified,
            gender: user.gender,
            birthdayDate: user.birthdayDate,
            location: user.location,
            region: user.region,
          });
        }
      }
    } catch {
      // Если Better-Auth не сработал, логируем и пробуем кастомную сессию
      console.log('Better-Auth session not found, trying custom session');
    }

    // 2. Если Better-Auth не сработал, пробуем кастомную сессию (для телефона пользователей)
    // Извлекаем session куку из заголовков запроса
    const sessionCookie = request.headers
      .get("cookie") // Получаем все куки
      ?.split(";") // Разделяем по точке с запятой
      .find((c) => c.trim().startsWith("session=")) // Ищем куку session
      ?.split("=")[1]; // Берем значение куки

    // Если кука session не найдена, возвращаем ошибку 401
    if (!sessionCookie) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Подключаемся к базе данных
    const db = await getDB();
    // Ищем сессию в коллекции session по token = значению куки
    const session = await db.collection("session").findOne({ 
      token: sessionCookie
    });

    // Если сессия не найдена, возвращаем ошибку 401
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Проверяем не истекла ли сессия
    if (new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Сессия истекла" }, { status: 401 });
    }

    // Ищем пользователя по userId из сессии
    const user = await db.collection("user").findOne({
      _id: new ObjectId(session.userId), // Конвертируем string ID в ObjectId
    });

    // Если пользователь не найден, возвращаем ошибку 404
    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Возвращаем данные пользователя
    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      phoneNumberVerified: user.phoneNumberVerified,
      gender: user.gender,
      birthdayDate: user.birthdayDate,
      location: user.location,
      region: user.region,
    });
    
  } catch (error) {
    // Ловим любые непредвиденные ошибки
    console.error("Error in user API:", error);
    // Возвращаем ошибку сервера 500
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}