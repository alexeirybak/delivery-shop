import { Order } from "@/types/order";

export const getStatusText = (order: Order): string => {
  if (order.paymentMethod === "online") {
    if (order.paymentStatus === "failed") {
      return "Не оплачен";
    } else if (order.paymentStatus === "paid" && order.status === "confirmed") {
      return "Подтвержден";
    } else if (
      order.paymentStatus === "waiting" &&
      order.status === "pending"
    ) {
      return "В процессе";
    }
  }

  if (order.paymentMethod === "cash_on_delivery") {
    if (order.status === "pending" && order.paymentStatus === "pending") {
      return "Доставляется";
    } else if (order.status === "confirmed") {
      return "Подтвержден";
    }
  }

  const statusMap: { [key: string]: string } = {
    pending: "В процессе",
    refund: "Возврат",
    returned: "Вернули",
    collected: "Собран",
    delivering: "Доставляется",
    confirmed: "Подтвержден",
    delivered: "Получен",
    cancelled: "Отменен",
  };

  return statusMap[order.status] || order.status;
};
