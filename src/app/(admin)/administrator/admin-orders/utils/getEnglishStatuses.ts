import { Order } from "@/types/order";

export const getEnglishStatuses = (russianStatus: string, order: Order): { status: string; paymentStatus?: string } => {
  // Для онлайн оплаты
  if (order.paymentMethod === "online") {
    switch (russianStatus) {
      case "Подтвержден":
        return { status: "confirmed", paymentStatus: "paid" };
      case "Не подтвердили":
        return { status: "pending", paymentStatus: "failed" };
      case "Новый":
        return { status: "pending", paymentStatus: "waiting" }; 
      case "Не оплачен":
        return { status: "pending", paymentStatus: "failed" };
    }
  }

  // Для оплаты при доставке
  if (order.paymentMethod === "cash_on_delivery") {
    switch (russianStatus) {
      case "Доставляется":
        return { status: "pending", paymentStatus: "pending" }; 
      case "Подтвержден":
        return { status: "confirmed", paymentStatus: "pending" };
      case "Новый":
        return { status: "pending", paymentStatus: "pending" }; 
    }
  }

  // Базовые статусы (не влияют на paymentStatus)
  const statusMap: { [key: string]: string } = {
    "В процессе": "pending",
    "Возврат": "refund", 
    "Вернули": "returned",
    "Собран": "collected",
    "Доставляется": "delivering",
    "Подтвержден": "confirmed",
    "Получен": "delivered",
    "Отменен": "cancelled",
  };

  return { status: statusMap[russianStatus] || "pending" };
};