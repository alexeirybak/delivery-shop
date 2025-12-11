import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  handleCatalogProductRedirect,
  handleOldProductRedirect,
} from "../utils/middleware-redirects";

export async function middleware(request: NextRequest) {
  
  // 1. Защита закрытых путей
  if (request.nextUrl.pathname.startsWith('/profile') || 
      request.nextUrl.pathname.startsWith('/administrator') ||
      request.nextUrl.pathname.startsWith('/cart') ||
      request.nextUrl.pathname.startsWith('/favorite')) {
    
    const session = request.cookies.get("better-auth.session_token") || 
                   request.cookies.get("session");
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 2. Обработка редиректов для товаров
  const redirectHandlers = [
    handleCatalogProductRedirect,
    handleOldProductRedirect,
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