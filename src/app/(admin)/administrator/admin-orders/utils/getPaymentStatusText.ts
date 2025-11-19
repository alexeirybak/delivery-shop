import { Order } from "@/types/order";

export const getPaymentStatusText = (
  paymentStatus: Order["paymentStatus"]
): string => {
  switch (paymentStatus) {
    case "pending":
      return "Ожидает оплаты";
    case "waiting":
      return "Ожидание подтверждения";
    case "paid":
      return "Оплачен";
    case "failed":
      return "Ошибка оплаты";
    default:
      return paymentStatus;
  }
};
