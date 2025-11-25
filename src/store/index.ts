import { configureStore } from '@reduxjs/toolkit'
import { ordersApi } from './api/ordersApi'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [ordersApi.reducerPath]: ordersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(ordersApi.middleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']