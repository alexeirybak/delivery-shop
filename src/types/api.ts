// types/api.ts
import { Order } from './order';

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  orders?: Order[];
  stats?: OrderStats;
}

export interface OrdersResponse {
  orders: Order[];
  stats: OrderStats;
}

export interface OrderStats {
  nextThreeDaysOrders: number;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: string;
  paymentStatus?: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
}

export interface MongoDBUpdateResult {
  modifiedCount: number;
  upsertedCount: number;
  matchedCount: number;
}