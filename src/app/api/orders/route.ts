// app/api/orders/route.ts
import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const orderData = await request.json();

    // Получаем информацию о пользователе
    const user = await db.collection("user").findOne({});
    
    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Создаем заказ - используем данные как есть из orderData
    const order = {
      userId: user._id,
      orderNumber: `Заказ №${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      status: "pending",
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'waiting',
      totalAmount: orderData.finalPrice,
      discountAmount: orderData.totalDiscount,
      usedBonuses: orderData.usedBonuses, // Должно приходить из CartSummary
      earnedBonuses: orderData.totalBonuses,
      deliveryAddress: orderData.deliveryAddress,
      deliveryDate: orderData.deliveryTime.date,
      deliveryTimeSlot: orderData.deliveryTime.timeSlot,
      items: orderData.cartItems.map((item: { productId: string; quantity: number; price: number }) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price, // Используем price из cartItems
        // Убираем productData - не нужно
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("Создаем заказ с usedBonuses:", order.usedBonuses);

    // Сохраняем заказ в коллекции orders
    const result = await db.collection("orders").insertOne(order);

    // Добавляем заказ в историю покупок пользователя
    const purchaseItem = {
      orderId: result.insertedId,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      totalAmount: order.totalAmount,
      status: order.status,
      usedBonuses: orderData.usedBonuses, // Сохраняем usedBonuses
      earnedBonuses: orderData.totalBonuses
    };

    // Обновляем массив покупок
    const currentPurchases = user.purchases || [];
    const updatedPurchases = [...currentPurchases, purchaseItem];

    await db.collection("user").updateOne(
      { _id: user._id },
      { 
        $set: { 
          purchases: updatedPurchases
        } 
      }
    );

    return NextResponse.json({ 
      success: true, 
      order: {
        ...order,
        _id: result.insertedId
      },
      orderNumber: order.orderNumber
    });

  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}