import { NextResponse } from "next/server";

export async function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
