import { useOptimistic, useState, useTransition } from "react";
import { Article, ArticleTableProps } from "../types";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { SearchBar } from "./SearchBar";
import { FilterControls } from "./FilterControls";
import { ResultsStats } from "./ResultsStats";
import { AdvancedFilters } from "./AdvancedFilters";
import { TableHeader } from "./TableHeader";
import { EmptyState } from "./EmptyState";
import { SortableItem } from "./SortableItem";

export const ArticleTable = ({ onReorder }: ArticleTableProps) => {
  const {
    articles,
    loading,
    draggedId,
    setDraggedId,
    dragOverId,
    setDragOverId,
  } = useArticlesManagementStore();

  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticArticles, setOptimisticArticles] = useOptimistic(
    articles,
    (
      currentArticles,
      { draggedId, droppedId }: { draggedId: string; droppedId: string },
    ) => {
      const draggedArticle = currentArticles.find(
        (a) => a._id.toString() === draggedId,
      );
      const droppedArticle = currentArticles.find(
        (a) => a._id.toString() === droppedId,
      );

      if (!draggedArticle || !droppedArticle) return currentArticles;

      return currentArticles
        .map((article) => {
          if (article._id.toString() === draggedId) {
            return { ...article, numericId: droppedArticle.numericId };
          }

          if (article._id.toString() === draggedId) {
            return { ...article, numericId: draggedArticle.numericId };
          }

          return article;
        })
        .sort((a, b) => a.numericId - b.numericId);
    },
  );

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = async (e: React.DragEvent, droppedId: string) => {
    e.preventDefault();

    if (!draggedId || draggedId === droppedId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    startTransition(() => {
      setOptimisticArticles({ draggedId, droppedId });
    });

    try {
      const draggedArticle = articles.find(
        (a) => a._id.toString() === draggedId,
      );
      const droppedArticle = articles.find(
        (a) => a._id.toString() === droppedId,
      );

      if (!draggedArticle || !droppedArticle) return;

      const updatedDraggedArticle = {
        ...draggedArticle,
        numericId: droppedArticle.numericId,
      };
      const updatedDroppedArticle = {
        ...droppedArticle,
        numericId: draggedArticle.numericId,
      };

      if (onReorder) {
        onReorder([updatedDraggedArticle, updatedDroppedArticle]);
      }
    } catch (error) {
      console.error("Ошибка", error);
    } finally {
      setDraggedId(null);
      setDragOverId(null);
    }
  };

  const getDisplayNumericId = (article: Article): number | null => {
    return article.numericId;
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Загрузка статей...</div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <SearchBar />
          <FilterControls onToggleFilters={setShowFilters} />
        </div>

        <ResultsStats />

        {showFilters && <AdvancedFilters />}
      </div>

      <TableHeader />
      <div className="divide-y divide-gray-200">
        {articles.length === 0 ? (
          <EmptyState />
        ) : (
          optimisticArticles.map((article) => {
            const articleId = article._id.toString();
            const isDragOver = dragOverId === articleId;

            return (
              <div
                key={articleId}
                draggable="true"
                onDragStart={() => handleDragStart(articleId)}
                onDragOver={(e) => handleDragOver(e, articleId)}
                onDrop={(e) => handleDrop(e, articleId)}
                className={`${isDragOver ? "bg-blue-50" : ""} ${isPending ? "opacity-50" : ""}`}
              >
                <SortableItem
                  id={articleId}
                  article={article}
                  displayNumericId={getDisplayNumericId(article)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
