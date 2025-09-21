import { NextResponse } from 'next/server';
import { getDB } from '../../../../utils/api-routes';

interface PriceAlertDocument {
  productId: string;
  email: string;
  productTitle: string;
  currentPrice: number;
  createdAt: Date;
  lastNotified?: Date | null;
}

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const { productId, email, productTitle, currentPrice } = await request.json();

    const existingAlert = await db.collection<PriceAlertDocument>('priceAlerts').findOne({
      productId,
      email,
    });

    if (existingAlert) {
      return NextResponse.json(
        { error: 'Вы уже подписаны на уведомления для этого товара' },
        { status: 400 }
      );
    }

    await db.collection<PriceAlertDocument>('priceAlerts').insertOne({
      productId,
      email: email.toLowerCase(),
      productTitle,
      currentPrice,
      createdAt: new Date(),
      lastNotified: null
    });

    return NextResponse.json({ 
      success: true,
      message: 'Подписка оформлена! Мы уведомим вас о снижении цены.' 
    });

  } catch (error) {
    console.error('Ошибка создания подписки:', error);
    return NextResponse.json(
      { error: 'Ошибка оформления подписки' },
      { status: 500 }
    );
  }
}