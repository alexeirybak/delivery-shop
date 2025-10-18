export const createOrderAction = async (orderData: {
  deliveryAddress: {
    city: string;
    street: string;
    house: string;
    apartment?: string;
    additional?: string;
  };
  deliveryTime: {
    date: string;
    timeSlot: string;
  };
  cartItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  usedBonuses: number;
  paymentMethod: "cash_on_delivery" | "online";
  paymentId?: string;
}) => {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Ошибка при создании заказа");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка создания заказа:", error);
    throw error;
  }
};