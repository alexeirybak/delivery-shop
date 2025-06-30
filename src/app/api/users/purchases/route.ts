import { getDB } from "../../../../../utils/api-routes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const url = new URL(request.url);
    const userPurchasesLimit = url.searchParams.get("userPurchasesLimit");

    const user = await db.collection("users").findOne({});

    if (!user?.purchases?.length) {
      return NextResponse.json([]);
    }

    // 3. Получаем массив ID купленных товаров
    const productIds = user.purchases.map((p: { id: number }) => p.id);

    // 4. Если запрошен лимит - возвращаем указанное количество последних покупок
    if (userPurchasesLimit) {
      const limit = parseInt(userPurchasesLimit);

      const products = await db
        .collection("products")
        .find({ id: { $in: productIds } })
        .limit(limit) // Ограничиваем количество
        .toArray();

      return NextResponse.json(
        products.map((product) => {
          const { discountPercent, ...rest } = product;
          void discountPercent;
          return rest;
        })
      );
    }

    // 5. Без лимита - возвращаем все покупки
    const allProducts = await db
      .collection("products")
      .find({ id: { $in: productIds } })
      .toArray();

    return NextResponse.json(
      allProducts.map((product) => {
        const { discountPercent, ...rest } = product;
        void discountPercent;
        return rest;
      })
    );
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке купленных продуктов" },
      { status: 500 }
    );
  }
}
