import { Order } from "@/types/order";

/**
 * Получает уникальные города из массива заказов
 * @param orders - массив заказов
 * @returns массив городов, начиная с "Все города"
 */
export const getUniqueCities = (orders: Order[]): string[] => {
  // Создаем Set для автоматического удаления дубликатов
  const cities = new Set(
    // Проходим по всем заказам и получаем города
    orders
      .map((order) => order.deliveryAddress?.city) // Берем только города из адреса доставки
      .filter((city): city is string => Boolean(city) && city !== "") // Убираем пустые и undefined, утверждаем тип string
  );

  // Возвращаем массив: "Все города" + уникальные города
  return ["Все города", ...cities];
};