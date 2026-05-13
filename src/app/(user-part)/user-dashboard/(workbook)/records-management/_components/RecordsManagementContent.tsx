"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Header } from "../../records/_components/Header";
import { Notification } from "../../workbook/_components/Notification";
import { ItemsPerPageSelector } from "../../workbook/_components/ItemsPerPageSelector";
import { Pagination } from "../../workbook/_components/Pagination";
import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import { useRecordsReorder } from "../hooks/useRecordsReorder";
import { Record } from "../types";
import { RecordTable } from "./RecordTable";
import { useRecords } from "../../records/hooks/useRecords";
import "./../../../styles/generate-page.css";
import "../styles/records-management.css";

const RecordsManagementContent = () => {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    totalAllItems,
    totalPages,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    setIsReordering,
  } = useRecordsManagementStore();

  const { loadRecords, reorderRecords } = useRecordsReorder();
  const { deleteRecord } = useRecords();

  useEffect(() => {
    if (notification) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const timer = setTimeout(() => {
        setNotification(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    loadRecords({ page: currentPage });
  }, [currentPage, loadRecords]);

  const handleReorder = useCallback(async (reorderedRecords: Record[]) => {
    setIsReordering(true);

    try {
      const dataForApi = reorderedRecords.map((record) => ({
        _id: record._id.toString(),
        numericId: record.numericId || 0,
      }));

      const result = await reorderRecords(dataForApi);

      if (result.success) {
        setNotification({
          type: "success",
          message: "Порядок записей успешно обновлен",
        });
        await loadRecords({ page: currentPage });
      } else {
        setNotification({
          type: "error",
          message: result.message || "Ошибка обновления порядка",
        });
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Ошибка в handleReorder:", error);
      setNotification({
        type: "error",
        message: "Произошла ошибка при обновлении порядка",
      });
      throw error;
    } finally {
      setIsReordering(false);
    }
  }, [currentPage, loadRecords, reorderRecords, setIsReordering]);

  const handleDeleteRecord = useCallback(async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту запись?")) return;

    try {
      const result = await deleteRecord(id);

      if (result.success) {
        setNotification({
          type: "success",
          message: "Запись успешно удалена",
        });
        await loadRecords({ page: currentPage });
      } else {
        setNotification({
          type: "error",
          message: result.message || "Ошибка удаления записи",
        });
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      setNotification({
        type: "error",
        message: "Произошла ошибка при удалении записи",
      });
    }
  }, [currentPage, deleteRecord, loadRecords]);

  const handleItemsPerPageChange = useCallback((perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
    loadRecords({ page: 1 });
  }, [setItemsPerPage, setCurrentPage, loadRecords]);

  const memoizedRecordTable = useMemo(() => {
    return <RecordTable onReorder={handleReorder} onDelete={handleDeleteRecord} />;
  }, [handleReorder, handleDeleteRecord]);

  return (
    <div className="generate-page">
      <Header
        title="Все записи"
        description={`Всего записей: ${totalAllItems}`}
      />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="records-controls">
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        <div className="records-info">
          Текущие параметры: страница {currentPage}, элементов: {itemsPerPage}
        </div>
      </div>
      {memoizedRecordTable}
      {totalPages > 1 && <Pagination type="records" />}
    </div>
  );
};

export default RecordsManagementContent;