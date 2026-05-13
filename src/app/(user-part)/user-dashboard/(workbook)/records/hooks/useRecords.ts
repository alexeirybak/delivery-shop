import { RecordApiResponse } from "../types";
import { RecordFormData } from "../types/form/form.types";

export const useRecords = () => {
  const createRecord = async (
    recordData: RecordFormData,
  ): Promise<RecordApiResponse> => {
    try {
      const response = await fetch("/api/workbook/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recordData),
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: responseData.message || "Запись успешно создана",
          data: responseData.data,
        };
      } else {
        console.error("Ошибка от сервера:", responseData);
        return {
          success: false,
          message:
            responseData.message ||
            `Ошибка ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ошибка сети при создании записи",
      };
    }
  };

  const getRecord = async (id: string): Promise<RecordApiResponse> => {
    try {
      const response = await fetch(`/api/workbook/records-management/${id}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Запись загружена",
          data: data.data,
        };
      } else {
        return {
          success: false,
          message: data.message || "Ошибка загрузки записи",
        };
      }
    } catch (error) {
      console.error("Ошибка загрузки записи:", error);
      return {
        success: false,
        message: "Ошибка сети при загрузке записи",
      };
    }
  };

  const deleteRecord = async (id: string): Promise<RecordApiResponse> => {
    try {
      const response = await fetch(`/api/workbook/records?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Запись успешно удалена",
        };
      } else {
        console.error("Ошибка от сервера:", data);
        return {
          success: false,
          message:
            data.message || `Ошибка ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ошибка сети при удалении записи",
      };
    }
  };

  return {
    createRecord,
    getRecord,
    deleteRecord,
  };
};
