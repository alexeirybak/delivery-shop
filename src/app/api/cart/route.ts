import { NextResponse } from "next/server";
import { getOrderCartAction } from "@/actions/orderActions";

export async function GET() {
  try {
    const cartItems = await getOrderCartAction();
    console.log("API cart items:", cartItems); // Добавляем лог
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error in cart API:", error);
    return NextResponse.json([], { status: 500 });
  }
}