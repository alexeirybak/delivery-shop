import { NextResponse } from "next/server";
import { getBetterAuthSession, getCustomSessionToken, validateCustomSession } from "../../../../../utils/auth-helpers";

export async function GET(request: Request) {
  try {
    const betterAuthSession = await getBetterAuthSession(request.headers);
    if (betterAuthSession) return NextResponse.json({ isAuth: true });

    const sessionToken = getCustomSessionToken(request.headers.get("cookie"));
    if (!sessionToken) return NextResponse.json({ isAuth: false });

    const isAuth = await validateCustomSession(sessionToken);
    return NextResponse.json({ isAuth });
  } catch (error) {
    console.error("Error in check-session:", error);
    return NextResponse.json({ isAuth: false });
  }
}
