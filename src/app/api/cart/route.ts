import { getOrderCartAction } from "@/actions/orderActions";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const cartItems = await getOrderCartAction();
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error in cart API:", error);
    return NextResponse.json([], { status: 500 });
  }
}