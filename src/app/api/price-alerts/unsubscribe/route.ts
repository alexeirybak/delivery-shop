import { NextRequest, NextResponse } from "next/server";
import { unsubscribePriceAlert } from "@/actions/priceAlerts";
import { baseUrl } from "../../../../../utils/baseUrl";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(
        `${baseUrl}/catalog/product/unsubscribe/error?message=Неверные параметры запроса`,
      );
    }

    const result = await unsubscribePriceAlert(token);

    if (result.error) {
      return NextResponse.redirect(
        `${baseUrl}/catalog/product/unsubscribe/error?message=${encodeURIComponent(result.error)}`,
      );
    }

    return NextResponse.redirect(
      `${baseUrl}/catalog/product/unsubscribe/success`,
    );
  } catch (error) {
    console.error("Ошибка отписки:", error);
    return NextResponse.redirect(
      `${baseUrl}/catalog/product/unsubscribe/error?message=Ошибка при отписке`,
    );
  }
}
