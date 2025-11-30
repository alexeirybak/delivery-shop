import { ChatMessage } from "@/types/chat";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/", 
  }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getOrderMessages: builder.query<ChatMessage[], string>({
      query: (orderId) => `chat/${orderId}`,
      providesTags: ["Chat"],
    }),
    sendMessage: builder.mutation<ChatMessage, Partial<ChatMessage>>({
      query: (message) => ({
        url: "chat",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Chat"],
    }),
    markAsRead: builder.mutation<void, { orderId: string; userId: string }>({
      query: ({ orderId, userId }) => ({
        url: `chat/${orderId}/read`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["Chat"],
    }),
    getUnreadCount: builder.query<number, string>({
      query: (orderId) => `chat/${orderId}/unread`,
      providesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetOrderMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useGetUnreadCountQuery,
} = chatApi;

export type { ChatMessage };
