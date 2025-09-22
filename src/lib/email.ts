// Импорт необходимых модулей
import { Resend } from "resend"; // Библиотека для отправки email через Resend сервис
import dotenv from "dotenv"; // Для работы с переменными окружения
import path from "path"; // Для работы с путями файловой системы
import PriceAlertEmail from "@/app/(catalog)/catalog/[category]/(product)/[id]/_components/PriceAlertEmail"; // React компонент письма

// Загрузка переменных окружения из .env файла в корне проекта
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Получение API ключа Resend из переменных окружения
const resendApiKey = process.env.RESEND_API_KEY;
// Создание экземпляра Resend клиента для работы с API
const resend = new Resend(resendApiKey);

// Основная функция отправки email уведомления о снижении цены
export async function sendPriceAlertEmail({
  to, // Email получателя
  productTitle, // Название товара
  oldPrice, // Старая цена (до снижения)
  newPrice, // Новая текущая цена
  productId, // ID товара для ссылки
  unsubscribeToken, // Токен для отписки от уведомлений
}: {
  to: string;
  productTitle: string;
  oldPrice: number;
  newPrice: number;
  productId: string;
  unsubscribeToken: string;
}) {
  try {
    // Кодирование названия товара для URL (защита от спецсимволов)
    const encodedTitle = encodeURIComponent(productTitle);
    // Формирование URL страницы товара с параметром для SEO
    const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/${productId}?desc=${encodedTitle}`;
    // Формирование URL для отписки от уведомлений
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/price-alerts/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(to)}`;

    // Отправка email через Resend API
    const { error } = await resend.emails.send({
      from: "Северяночка <onboarding@resend.dev>", // Отправитель (имя + email)
      to, // Получатель
      subject: `💰 Цена на "${productTitle}" снизилась!`, // Тема письма
      react: PriceAlertEmail({ // React компонент как тело письма
        productTitle,
        oldPrice,
        newPrice,
        productUrl,
        unsubscribeUrl,
      }),
    });

    // Обработка ошибки отправки (если Resend вернул ошибку)
    if (error) {
      console.error("Ошибка отправки письма:", error);
      return false; // Возвращаем false при ошибке
    }

    return true; // Успешная отправка

  } catch (error) {
    // Обработка непредвиденных ошибок (сетевая проблема и т.д.)
    console.error("Ошибка отправки письма:", error);
    return false; // Возвращаем false при любой ошибке
  }
}