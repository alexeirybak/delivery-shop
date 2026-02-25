"use client";

import { useEffect, useState } from "react";
import { Header } from "../../_components/Header";
import { Notification } from "../../_components/Notification";
import { ItemsPerPageSelector } from "../../../../_components/ItemsPerPageSelector";
import { Pagination } from "../../../../_components/Pagination";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { Article } from "./types";
import { ArticleTable } from "./_components/ArticleTable";
import { useArticlesReorder } from "./hooks/useArticlesReorder";

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

  const { loadArticles, reorderArticles } = useArticlesReorder();

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

  const handleReorder = async (reorderedCategories: Article[]) => {
    setIsReordering(true);

    try {
      const dataForApi = reorderedCategories.map((category) => ({
        _id: category._id.toString(),
        numericId: category.numericId || 0,
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
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setNotification({
        type: "error",
        message: "Произошла ошибка при обновлении порядка",
      });
      throw error;
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
      <ArticleTable onReorder={handleReorder} />
      {totalPages > 1 && <Pagination type="articles" />}
    </div>
  );
};

export default ArticlesManagementPage;
