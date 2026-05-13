import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import { ApiResponse } from "../../records/types";

export const useRecordsReorder = () => {
  const { loadRecords } = useRecordsManagementStore();

  const reorderRecords = async (
    records: Array<{
      _id: string;
      numericId: number;
    }>,
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        "/api/workbook/records-management/reorder",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(records),
        },
      );

      const data = await response.json();

      if (response.ok) {
        await loadRecords();
        return {
          success: true,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (error) {
      console.error("Ошибка переупорядочивания:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ошибка сети при переупорядочивании",
      };
    }
  };
  return { loadRecords, reorderRecords };
};