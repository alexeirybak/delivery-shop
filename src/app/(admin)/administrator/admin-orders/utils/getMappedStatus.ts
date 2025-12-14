import { Order } from "@/types/order";
import { CUSTOMER_STATUSES } from "./customerStatuses";

export const getMappedStatus = (order: Order): string => {
  if (order.paymentMethod === "online") {
    if (order.paymentStatus === "paid" && order.status === "confirmed") {
      return "Подтвержден";
    } else if (order.paymentStatus === "failed" && order.status === "cancelled") { // ← ИСПРАВЛЕНО
      return "Не подтвердили";
    } else if (order.paymentStatus === "waiting" && order.status === "pending") {
      return "Новый";
    }
  }

  if (order.paymentMethod === "cash_on_delivery") {
    if (order.status === "pending" && order.paymentStatus === "pending") {
      return "Новый";
    } else if (order.status === "confirmed") {
      return "Подтвержден";
    }
  }

  // Базовый маппинг
  const statusFromValue = CUSTOMER_STATUSES.find(status => status.value === order.status);
  if (statusFromValue) {
    return statusFromValue.label;
  }

  return "Новый";
};