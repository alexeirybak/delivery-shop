// Импорт NextResponse из Next.js для создания HTTP ответов
import { NextResponse } from "next/server";
// Импорт функции getDB для подключения к базе данных
import { getDB } from "../../../../../utils/api-routes";
import { auth } from "@/lib/auth"; // Импортируем Better-Auth

// Экспорт асинхронной функции GET для обработки GET запросов
export async function GET(request: Request) {
  try {
    // 1. Сначала пробуем через Better-Auth (для OTP сессий)
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (session) {
        return NextResponse.json({ isAuth: true });
      }
    } catch (error) {
      console.log('Better-Auth session check failed:', error);
    }

    // 2. Если Better-Auth не сработал, пробуем кастомную сессию (для парольных сессий)
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";").map(c => c.trim());
    
    // Ищем кастомную куку session
    const sessionToken = cookies
      .find(c => c.startsWith("session="))
      ?.split("=")[1];

    console.log(`Кастомная сессионная кука: ${sessionToken || 'undefined'}`);

    if (!sessionToken) {
      return NextResponse.json({ isAuth: false });
    }

    const db = await getDB();
    // Ищем сессию в коллекции "session" по token = значению куки
    const session = await db.collection("session").findOne({
      token: sessionToken,
    });

    // Проверяем: есть ли сессия И не истекла ли она
    const isAuth = !!session && new Date(session.expiresAt) > new Date();

    // Возвращаем JSON ответ с статусом авторизации
    return NextResponse.json({ isAuth });
  } catch (error) {
    console.error("Error in check-session:", error);
    // В случае ошибки возвращаем что пользователь не авторизован
    return NextResponse.json({ isAuth: false });
  }
}