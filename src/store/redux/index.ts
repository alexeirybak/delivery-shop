import { configureStore } from "@reduxjs/toolkit";
import { ordersApi } from "./api/ordersApi";
import { chatApi } from "./api/chatApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [ordersApi.reducerPath]: ordersApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(ordersApi.middleware, chatApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
