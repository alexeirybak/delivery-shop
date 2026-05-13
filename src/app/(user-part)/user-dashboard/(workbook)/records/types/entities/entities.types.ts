import { Record } from "../models/record.types";

export interface SimpleApiResponse {
  success: boolean;
  message?: string;
}

export interface RecordApiResponse extends SimpleApiResponse {
  data?: Record;
}

export interface RecordsApiResponse extends SimpleApiResponse {
  data?: {
    records: Record[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
