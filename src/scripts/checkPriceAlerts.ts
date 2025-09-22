// Импорт необходимых модулей
import { ObjectId } from 'mongodb'; // Для работы с MongoDB ObjectId
import { sendPriceAlertEmail } from '../lib/email'; // Функция отправки email
import { getDB } from '../../utils/api-routes'; // Утилита для подключения к БД
import dotenv from 'dotenv'; // Для загрузки переменных окружения

// Загрузка переменных окружения из .env файла
dotenv.config();

// Интерфейс для подписки на уведомления о ценах
interface PriceAlert {
  _id: ObjectId; // Уникальный идентификатор подписки
  productId: string; // ID товара для отслеживания
  email: string; // Email пользователя для уведомлений
  productTitle: string; // Название товара (для email)
  currentPrice: number; // Цена при подписке
  unsubscribeToken: string; // Токен для отписки от уведомлений
  createdAt: Date; // Дата создания подписки
  lastNotified?: Date; // Дата последнего уведомления (опционально)
}

// Интерфейс для товара
interface Product {
  _id: ObjectId; // Уникальный идентификатор товара
  id: number; // Публичный ID товара
  title: string; // Название товара
  basePrice: number; // Базовая цена без скидок
  discountPercent?: number; // Процент скидки (опционально)
}

// Основная функция проверки цен и отправки уведомлений
export async function checkPriceAlerts(): Promise<void> {
  try {
    // Подключение к базе данных
    const db = await getDB();
    
    // Получение всех активных подписок из коллекции priceAlerts
    const activeAlerts = await db.collection<PriceAlert>('priceAlerts')
      .find({}) // Находим все документы
      .toArray(); // Преобразуем в массив

    // Логирование количества найденных подписок
    console.log(`Найдено подписок: ${activeAlerts.length}`);

    // Если подписок нет - завершаем выполнение
    if (activeAlerts.length === 0) {
      console.log('Нет активных подписок для проверки');
      return;
    }

    // Счетчик отправленных уведомлений
    let notificationsSent = 0;

    // Итерация по всем подпискам
    for (const alert of activeAlerts) {
      try {
        // Поиск товара по ID в коллекции products
        const product = await db.collection<Product>('products')
          .findOne({ id: parseInt(alert.productId) }); // Преобразуем string в number

        // Если товар не найден - пропускаем итерацию
        if (!product) {
          console.log(`Товар с id="${alert.productId}" не найден`);
          continue; // Переходим к следующей подписке
        }

        // Расчет текущей цены с учетом скидки (если есть)
        const currentPrice = product.discountPercent 
          ? Math.round(product.basePrice * (1 - (product.discountPercent / 100))) // Цена со скидкой
          : product.basePrice; // Базовая цена без скидки

        // Проверка: снизилась ли цена относительно цены подписки
        if (currentPrice < alert.currentPrice) {
          // Отправка email уведомления о снижении цены
          const emailSent = await sendPriceAlertEmail({
            to: alert.email, // Email получателя
            productTitle: alert.productTitle, // Название товара
            oldPrice: alert.currentPrice, // Старая цена (при подписке)
            newPrice: currentPrice, // Новая текущая цена
            productId: alert.productId, // ID товара
            unsubscribeToken: alert.unsubscribeToken // Токен для отписки
          });

          // Если email успешно отправлен
          if (emailSent) {
            // Обновление подписки в базе данных
            await db.collection<PriceAlert>('priceAlerts').updateOne(
              { _id: alert._id }, // Поиск по ID подписки
              { 
                $set: { 
                  currentPrice: currentPrice, // Обновляем текущую цену
                  lastNotified: new Date() // Устанавливаем время последнего уведомления
                }
              }
            );
            // Увеличиваем счетчик отправленных уведомлений
            notificationsSent++;
          }
        }

      } catch (error) {
        // Обработка ошибок для отдельной подписки (чтобы не прерывать весь процесс)
        console.error('Ошибка обработки подписки:', error);
      }
    }

    // Финальное логирование результатов проверки
    console.log(`Проверка завершена. Отправлено уведомлений: ${notificationsSent}`);

  } catch (error) {
    // Обработка критических ошибок (проблемы с БД и т.д.)
    console.error('Критическая ошибка:', error);
    throw error; // Пробрасываем ошибку выше
  }
}
