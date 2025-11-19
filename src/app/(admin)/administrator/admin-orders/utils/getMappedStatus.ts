import { Order } from "@/types/order";
import { CUSTOMER_STATUSES } from "./customerStatuses";

// Функция для получения русского отображения статуса из английского
export const getMappedStatus = (order: Order): string => {
  // Сначала проверяем, есть ли статус заказа в наших CUSTOMER_STATUSES
  const statusFromValue = CUSTOMER_STATUSES.find(status => status.value === order.status);
  if (statusFromValue) {
    return statusFromValue.label;
  }

  // Затем проверяем сложные условия для онлайн оплаты
  if (order.paymentMethod === "online") {
    if (order.paymentStatus === "paid" && order.status === "confirmed") {
      return "Подтвержден";
    } else if (order.paymentStatus === "failed") {
      return "Не подтвердили";
    } else if (order.paymentStatus === "waiting" && order.status === "pending") {
      return "Новый";
    }
  }

  // Условия для наличной оплаты
  if (order.paymentMethod === "cash_on_delivery") {
    if (order.status === "pending" && order.paymentStatus === "pending") {
      return "Доставляется";
    } else if (order.status === "confirmed") {
      return "Подтвержден";
    }
  }

  // Базовый маппинг для обратной совместимости
  const statusMap: Record<string, string> = {
    pending: "Новый",
    confirmed: "Подтверждen",
    cancelled: "Не подтвердили",
    delivered: "Вернули",
    failed: "Возврат",
  };

  return statusMap[order.status] || "Новый";
};