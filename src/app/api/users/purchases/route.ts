import { CONFIG } from "../../../../../config/config";
import { getDB } from "../../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { getServerUserId } from "../../../../../utils/getServerUserId";
import { ObjectId } from "mongodb";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const db = await getDB();

    const url = new URL(request.url);
    const userPurchasesLimit = url.searchParams.get("userPurchasesLimit");
    const startIdx = parseInt(url.searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      url.searchParams.get("perPage") || CONFIG.ITEMS_PER_PAGE.toString()
    );

    const userId = await getServerUserId();

    if (!userId) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    const userObjectId = ObjectId.createFromHexString(userId);

    const user = await db.collection("user").findOne({
      _id: userObjectId,
    });

    if (!user?.purchases?.length) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    const productIds = user.purchases; // Просто берем массив чисел

    if (userPurchasesLimit) {
      const limit = parseInt(userPurchasesLimit);

      const purchases = await db
        .collection("products")
        .find({ id: { $in: productIds } })
        .limit(limit)
        .toArray();

      return NextResponse.json(
        purchases.map((product) => {
          const { discountPercent, ...rest } = product;
          void discountPercent;
          return rest;
        })
      );
    }

    const totalCount = productIds.length;

    const purchases = await db
      .collection("products")
      .find({ id: { $in: productIds } })
      .sort({ _id: -1 })
      .skip(startIdx)
      .limit(perPage)
      .toArray();

    return NextResponse.json({
      products: purchases.map((product) => {
        const { discountPercent, ...rest } = product;
        void discountPercent;
        return rest;
      }),
      totalCount,
    });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке купленных продуктов" },
      { status: 500 }
    );
  }
}
