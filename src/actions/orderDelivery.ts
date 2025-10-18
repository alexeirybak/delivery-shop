// import { CreateOrderRequest } from "@/types/order";

// export const createOrderAction = async (orderData: CreateOrderRequest) => {
//   try {
//     const response = await fetch("/api/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(orderData),
//     });

//     if (!response.ok) {
//       throw new Error("Ошибка при создании заказа");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Ошибка создания заказа:", error);
//     throw error;
//   }
// };
