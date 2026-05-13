import { NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { ObjectId } from "mongodb";
import { UserData } from "@/app/auth/types/user/user.types";

type UserUpdateData = Partial<
  Omit<UserData, "_id" | "createdAt" | "updatedAt">
>;

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const user = await db.collection("user").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      status: user.status || null,
      country: user.country || null,
      organization: user.organization || null,
      specialization: user.specialization || null,
      interests: user.interests || null,
      balance: user.balance || 0,
      role: user.role,
    });
  } catch (error) {
    console.error("Ошибка получения профиля:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const body = await request.json();
    const { country, email, status, specialization, organization, interests } =
      body;

    const db = await getDB();

    const currentUser = await db.collection("user").findOne({
      _id: new ObjectId(userId),
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const updateData: UserUpdateData = {};

    if (country !== undefined) updateData.country = country;
    if (status !== undefined) updateData.status = status;
    if (specialization !== undefined)
      updateData.specialization = specialization;
    if (organization !== undefined) updateData.organization = organization;
    if (interests !== undefined) updateData.interests = interests;

    if (email !== undefined && email !== currentUser.email) {
      updateData.email = email;
      updateData.emailVerified = false;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Нет данных для обновления" },
        { status: 400 },
      );
    }

    await db
      .collection("user")
      .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка обновления профиля:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
