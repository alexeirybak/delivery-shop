import { ObjectId } from 'mongodb';
import { sendPriceAlertEmail } from '@/lib/priceDiscountEmail';
import { getDB } from '../../utils/api-routes';
import dotenv from 'dotenv';

dotenv.config();

interface PriceAlert {
  _id: ObjectId;
  productId: string;
  email: string;
  productTitle: string;
  currentPrice: number; 
  unsubscribeToken: string; 
  createdAt: Date; 
  lastNotified?: Date;
}

interface Product {
  _id: ObjectId;
  id: number;
  title: string;
  basePrice: number;
  discountPercent?: number;
}

export async function checkPriceAlerts(): Promise<void> {
  try {
    const db = await getDB();
    
    const activeAlerts = await db.collection<PriceAlert>('priceAlerts')
      .find({})
      .toArray();

    console.log(`Найдено подписок: ${activeAlerts.length}`);

    if (activeAlerts.length === 0) {
      console.log('Нет активных подписок для проверки');
      return;
    }

    let notificationsSent = 0;

    for (const alert of activeAlerts) {
      try {
        const product = await db.collection<Product>('products')
          .findOne({ id: parseInt(alert.productId) });

        if (!product) {
          console.log(`Товар с id="${alert.productId}" не найден`);
          continue;
        }

        const currentPrice = product.discountPercent 
          ? Math.round(product.basePrice * (1 - (product.discountPercent / 100)))
          : product.basePrice;

        if (currentPrice < alert.currentPrice) {
          const emailSent = await sendPriceAlertEmail({
            to: alert.email,
            productTitle: alert.productTitle,
            oldPrice: alert.currentPrice,
            newPrice: currentPrice,
            productId: alert.productId,
            unsubscribeToken: alert.unsubscribeToken
          });

          if (emailSent) {
            await db.collection<PriceAlert>('priceAlerts').updateOne(
              { _id: alert._id },
              { 
                $set: { 
                  currentPrice: currentPrice,
                  lastNotified: new Date()
                }
              }
            );
            notificationsSent++;
          }
        }

      } catch (error) {
        console.error('Ошибка обработки подписки:', error);
      }
    }

    console.log(`Проверка завершена. Отправлено уведомлений: ${notificationsSent}`);

  } catch (error) {
    console.error('Критическая ошибка:', error);
    throw error;
  }
}
