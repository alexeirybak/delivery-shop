import { OrdersResponse } from "@/types/reduxApi";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getAdminOrders: builder.query<OrdersResponse, void>({
      query: () => "admin/users/orders",
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetAdminOrdersQuery } = ordersApi;
