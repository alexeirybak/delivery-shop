import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  handleCatalogProductRedirect,
  handleOldProductRedirect,
  handleQueryParamsRedirect,
  isStaticPath,
} from "../utils/middleware-redirects";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // === 1. Логика защиты путей (оставляем как есть) ===
  const protectedPaths = ["/profile", "/administrator", "/cart", "/favorite"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    try {
      const sessionCookie =
        request.cookies.get("better-auth.session_token") ||
        request.cookies.get("session");

      if (!sessionCookie) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // === 2. Пропускаем статические пути ===
  if (isStaticPath(url.pathname)) {
    return NextResponse.next();
  }

  // === 3. Обработка редиректов ===
  const redirectHandlers = [
    handleCatalogProductRedirect,
    handleOldProductRedirect,
    handleQueryParamsRedirect,
  ];

  for (const handler of redirectHandlers) {
    const redirectResponse = await handler(request);
    if (redirectResponse) {
      return redirectResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/administrator/:path*",
    "/catalog/:path*",
    "/product/:path*",
  ],
};