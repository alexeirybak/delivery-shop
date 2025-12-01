import { Order } from "@/types/order";

export const getEnglishStatuses = (russianStatus: string, order: Order): { status: string; paymentStatus?: string } => {
  // Для онлайн оплаты
  if (order.paymentMethod === "online") {
    switch (russianStatus) {
      case "Подтвержден":
        return { status: "confirmed", paymentStatus: "paid" };
      case "Не подтвердили":
        return { status: "cancelled", paymentStatus: "failed" }; // ← ИСПРАВЛЕНО: "cancelled"
      case "Новый":
        return { status: "pending", paymentStatus: "waiting" };
    }
  }

  // Для оплаты при доставке  
  if (order.paymentMethod === "cash_on_delivery") {
    switch (russianStatus) {
      case "Подтвержден":
        return { status: "confirmed", paymentStatus: "pending" };
      case "Новый":
        return { status: "pending", paymentStatus: "pending" };
    }
  }

  // Общий маппинг
  const statusMap: { [key: string]: string } = {
    "Новый": "pending",
    "Собран": "collected",
    "Доставляется": "delivering",
    "Подтвержден": "confirmed", 
    "Не подтвердили": "cancelled", // ← ДОБАВЛЕНО
    "Возврат": "refund",
    "Вернули": "returned",
    "Получен": "delivered",
  };

  return { status: statusMap[russianStatus] || "pending" };
};