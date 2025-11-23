export const CUSTOMER_STATUSES = [
  { value: "pending", icon: "/icons-orders/icon-bag.svg", label: "Новый" },
  { value: "collected", icon: "/icons-orders/icon-check.svg", label: "Собран" },
  {
    value: "delivering",
    icon: "/icons-orders/icon-delivery.svg",
    label: "Доставляется",
  },
  {
    value: "confirmed",
    icon: "/icons-orders/icon-check-circle.svg",
    label: "Подтвержден",
  },
  {
    value: "cancelled",
    icon: "/icons-orders/icon-alert-circle.svg",
    label: "Не подтвердили",
  },
  {
    value: "refund",
    icon: "/icons-orders/icon-alert-triangle.svg",
    label: "Возврат",
  },
  { value: "returned", icon: "/icons-orders/icon-home.svg", label: "Вернули" },
];
