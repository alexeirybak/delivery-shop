import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

// app/api/auth/check-session/route.ts
export async function GET(request: Request) {
  try {
    const sessionCookie = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ isAuth: false });
    }

    const db = await getDB();
    const session = await db.collection("session").findOne({ 
      token: sessionCookie 
    });

    const isAuth = !!session && new Date(session.expiresAt) > new Date();
    
    return NextResponse.json({ isAuth });

  } catch {
    return NextResponse.json({ isAuth: false });
  }
}