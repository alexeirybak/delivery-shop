import { Order } from "@/types/order";

export const getUniqueCities = (orders: Order[]) => {
  const cities = new Set(
    orders
      .map((order) => order.deliveryAddress?.city)
      .filter((city) => city && city !== "")
  );

  return ["Все города", ...cities];
};
