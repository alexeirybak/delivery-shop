import { getBetterAuthSession } from "@/lib/auth-helpers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const isAuth = await getBetterAuthSession(request.headers);
  return NextResponse.json({ isAuth });
}
