"use client";

import { Header } from "../../_components/Header";
import { Notification } from "../../_components/Notification";
import { useEffect, useState } from "react";
import { ItemsPerPageSelector } from "../../_components/ItemsPerPageSelector";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { useArticlesManagement } from "./hooks/useArticlesManagement";
import { Pagination } from "../../_components/Pagination";
import { ArticlesTable } from "./_components/ArticlesTable";
import { Article } from "./types";

const ArticlesManagementPage = () => {
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
  } = useArticlesManagementStore();

  const { loadArticles, reorderArticles } =
    useArticlesManagement();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    loadArticles({ page: currentPage });
  }, [currentPage, loadArticles]);

  const handleReorder = async (reorderedArticles: Article[]) => {
    setIsReordering(true);

    try {
      const dataForApi = reorderedArticles.map((article) => ({
        _id: article._id.toString(),
        numericId: article.numericId || 0,
      }));

      const result = await reorderArticles(dataForApi);

      if (result.success) {
        setNotification({
          type: "success",
          message: "Порядок статей успешно обновлен",
        });
      } else {
        setNotification({
          type: "error",
          message: result.message || "Ошибка обновления порядка",
        });
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setNotification({
        type: "error",
        message: "Произошла ошибка при обновлении порядка",
      });
    } finally {
      setIsReordering(false);
    }
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
    loadArticles({ page: 1 });
  };

  return (
    <div className="relative">
      <Header
        title="Управление статьями"
        description={`Всего статей: ${totalAllItems}`}
      />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="mb-4">
        <ItemsPerPageSelector
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        <div className="text-sm text-gray-500 mt-1">
          Текущие параметры: страница {currentPage}, элементов: {itemsPerPage}
        </div>
      </div>
      <div className="mb-4"></div>

      <ArticlesTable
        onReorder={handleReorder}
      />

      {totalPages > 1 && <Pagination type="articles" />}
    </div>
  );
};

export default ArticlesManagementPage;
