import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { CONFIG } from "../../../../../config/config";

interface UserFilter {
  region?: string;
  location?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(
      searchParams.get("limit") || CONFIG.DEFAULT_PAGE_SIZE.toString()
    );
    const page = parseInt(searchParams.get("page") || "1");
    const role = searchParams.get("role");
    const managerRegion = searchParams.get("managerRegion");
    const managerLocation = searchParams.get("managerLocation");
    const isManager = searchParams.get("isManager") === "true";

    const db = await getDB();

    const filter: UserFilter = {};

    if (isManager && managerRegion && managerLocation) {
      filter.region = managerRegion;
      filter.location = managerLocation;
    }

    const users = await db.collection("user").find(filter).toArray();

    const totalCount = await db.collection("user").countDocuments(filter);

    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name || "",
      surname: user.surname || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      role: user.role || "user",
      birthdayDate: user.birthdayDate || "",
      region: user.region || "",
      location: user.location || "",
      gender: user.gender || "",
      card: user.card || "",
      hasCard: user.hasCard || false,
      createdAt: user.createdAt
        ? user.createdAt.toISOString()
        : new Date().toISOString(),
      updatedAt: user.updatedAt
        ? user.updatedAt.toISOString()
        : new Date().toISOString(),
      emailVerified: user.emailVerified || false,
      phoneNumberVerified: user.phoneNumberVerified || false,
    }));

    return NextResponse.json({
      users: formattedUsers,
      totalCount,
    });
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке пользователей" },
      { status: 500 }
    );
  }
}
