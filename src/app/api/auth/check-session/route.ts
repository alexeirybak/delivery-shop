// Импорт NextResponse из Next.js для создания HTTP ответов
import { NextResponse } from "next/server";
// Импорт функции getDB для подключения к базе данных
import { getDB } from "../../../../../utils/api-routes";

// Экспорт асинхронной функции GET для обработки GET запросов
export async function GET(request: Request) {
  try {
    // Получаем все куки из заголовка запроса
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";").map(c => c.trim());
    
    // 1. Сначала пробуем найти куку Better-Auth (новый формат)
    let sessionToken = cookies
      .find(c => c.startsWith("better-auth.session_token="))
      ?.split("=")[1];

    // 2. Если не нашли Better-Auth куку, пробуем найти кастомную (старый формат)
    if (!sessionToken) {
      sessionToken = cookies
        .find(c => c.startsWith("session="))
        ?.split("=")[1];
    }

    console.log(`Найденная сессионная кука: ${sessionToken || 'undefined'}`);
    console.log(`Все куки: ${cookieHeader}`);

    // Если ни одна кука не найдена, возвращаем что пользователь не авторизован
    if (!sessionToken) {
      return NextResponse.json({ isAuth: false });
    }

    // Декодируем URL-encoded значение (Better-Auth использует кодирование)
    const decodedToken = decodeURIComponent(sessionToken);

    const db = await getDB();
    // Ищем сессию в коллекции "session" по token = значению куки
    const session = await db.collection("session").findOne({
      token: decodedToken, // Используем декодированный токен
    });

    // Проверяем: есть ли сессия И не истекла ли она
    const isAuth = !!session && new Date(session.expiresAt) > new Date();
    // !!session - преобразует в boolean (true если сессия существует)
    // new Date(session.expiresAt) > new Date() - проверяет что дата истечения еще не наступила

    // Возвращаем JSON ответ с статусом авторизации
    return NextResponse.json({ isAuth });
  } catch (error) {
    // Ловим ошибки и логируем их
    console.error("Error in check-session:", error);
    // В случае ошибки возвращаем что пользователь не авторизован
    return NextResponse.json({ isAuth: false });
  }
}