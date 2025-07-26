import { authClient } from "../../../../utils/auth-client";
import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) return NextResponse.redirect("/verification-failed");

  const db = await getDB();

  // 1. Подтверждаем верификацию через Better-Auth
  const verification = await authClient.verifyEmail(token);
  if (!verification.success) {
    return NextResponse.redirect("/verification-failed");
  }

  // 2. Ищем временные данные в MongoDB
  const tempData = await db.collection("temp_profiles").findOne({
    email: verification.user.email
  });

  if (tempData) {
    // 3. Обновляем профиль в основной коллекции
    await db.collection("users").updateOne(
      { email: verification.user.email },
      {
        $set: {
          ...tempData.profileData,
          profileCompleted: true,
          updatedAt: new Date()
        }
      }
    );

    // 4. Удаляем временные данные
    await db.collection("temp_profiles").deleteOne({ 
      email: verification.user.email 
    });

    return NextResponse.redirect("/welcome");
  }

  // Если данных нет, отправляем на дополнение профиля
  return NextResponse.redirect("/complete-profile");
}