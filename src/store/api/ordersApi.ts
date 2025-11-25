import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrdersResponse } from "@/types/api";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Orders"], 
  endpoints: (builder) => ({
    getAdminOrders: builder.query<OrdersResponse, void>({
      query: () => "orders/admin-orders",
      providesTags: ["Orders"],
    }),
  }),
});

export const { 
  useGetAdminOrdersQuery 
} = ordersApi;