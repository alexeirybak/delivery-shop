// store/api/ordersApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrdersResponse } from "@/types/api";
import { Order } from "@/types/order";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Orders", "Order"],
  endpoints: (builder) => ({
    getAdminOrders: builder.query<OrdersResponse, void>({
      query: () => "orders/admin-orders",
      providesTags: ["Orders"],
    }),
    
    // Добавляем запрос для отдельного заказа
    getOrder: builder.query<Order, string>({
      query: (orderId) => `orders/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: "Order", id: orderId }],
    }),
  }),
});

export const { 
  useGetAdminOrdersQuery,
  useGetOrderQuery 
} = ordersApi;