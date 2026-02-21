import { Order } from "@/types/order";

export const getEnglishStatuses = (
  russianStatus: string,
  order: Order,
): { status: string; paymentStatus?: string } => {
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

  if (order.paymentMethod === "cash_on_delivery") {
    switch (russianStatus) {
      case "Подтвержден":
        return { status: "confirmed", paymentStatus: "pending" };
      case "Новый":
        return { status: "pending", paymentStatus: "pending" };
    }
  }

  const statusMap: { [key: string]: string } = {
    Новый: "pending",
    Собран: "collected",
    Доставляется: "delivering",
    Подтвержден: "confirmed",
    "Не подтвердили": "cancelled",
    Возврат: "refund",
    Вернули: "returned",
    Получен: "delivered",
  };

  return { status: statusMap[russianStatus] || "pending" };
};
