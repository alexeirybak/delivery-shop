export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface ReorderRequestItem {
  _id: string;
  numericId: number;
}
