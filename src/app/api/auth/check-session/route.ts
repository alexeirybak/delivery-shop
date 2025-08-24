// app/api/auth/check-session/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    return NextResponse.json({ isAuth: !!session });
  } catch {
    return NextResponse.json({ isAuth: false });
  }
}