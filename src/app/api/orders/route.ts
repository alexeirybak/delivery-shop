import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { getServerUserId } from "../../../../utils/getServerUserId";
import { ObjectId } from 'mongodb';
import { ProductCardProps } from "@/types/product";
import { OrderDB, OrderItemDB } from "@/types/order";

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const orderData = await request.json();

    const userId = await getServerUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Пользователь не авторизован" },
        { status: 401 }
      );
    }

    const user = await db.collection("user").findOne({
      _id: ObjectId.createFromHexString(userId),
    });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const roundedUsedBonuses = Math.floor(orderData.usedBonuses || 0);
    const roundedEarnedBonuses = Math.floor(orderData.totalBonuses || 0);
    const roundedTotalAmount =
      Math.round((orderData.finalPrice || 0) * 100) / 100;
    const roundedDiscountAmount =
      Math.round((orderData.totalDiscount || 0) * 100) / 100;

    const order = {
      userId: user._id,
      orderNumber: `${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
      status: "pending",
      paymentMethod: orderData.paymentMethod,
      paymentStatus:
        orderData.paymentMethod === "cash_on_delivery" ? "pending" : "waiting",
      totalAmount: roundedTotalAmount,
      discountAmount: roundedDiscountAmount,
      usedBonuses: roundedUsedBonuses,
      earnedBonuses: roundedEarnedBonuses,
      deliveryAddress: orderData.deliveryAddress,
      deliveryDate: orderData.deliveryTime.date,
      deliveryTimeSlot: orderData.deliveryTime.timeSlot,
      surname: user.surname,
      name: user.name,
      phone: user.phoneNumber,
      gender: user.gender,
      birthday: user.birthdayDate,
      items: orderData.cartItems.map(
        (item: {
          productId: string;
          quantity: number;
          price: number;
          discountPercent?: number;
          hasLoyaltyDiscount?: boolean;
        }) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: Math.round((item.price || 0) * 100) / 100,
          discountPercent: item.discountPercent,
          hasLoyaltyDiscount: item.hasLoyaltyDiscount,
        })
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        _id: result.insertedId,
      },
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Ошибка создания заказа:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDB();
    const userId = await getServerUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Пользователь не авторизован" },
        { status: 401 }
      );
    }

    const orders = await db
      .collection('orders')
      .find({ userId: ObjectId.createFromHexString(userId) })
      .sort({ createdAt: -1 })
      .toArray() as OrderDB[];

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item: OrderItemDB) => {
            try {
              const product = await db
                .collection('products')
                .findOne({ _id: item.productId }) as ProductCardProps | null;
              
              return {
                ...item,
                productId: item.productId.toString(), 
                productDetails: product ? {
                  _id: product._id.toString(),
                  id: product.id,
                  img: product.img,
                  title: product.title,
                  description: product.description,
                  basePrice: product.basePrice,
                  discountPercent: product.discountPercent,
                  weight: product.weight,
                  categories: product.categories,
                  brand: product.brand,
                  manufacturer: product.manufacturer
                } : null
              };
            } catch (itemError) {
              console.error('Ошибка при обработке товара:', itemError);
              return {
                ...item,
                productId: item.productId?.toString?.(),
                productDetails: null
              };
            }
          })
        );

        return {
          ...order,
          _id: order._id.toString(),
          userId: order.userId.toString(),
          items: itemsWithProducts
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      orders: ordersWithProducts 
    });
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}