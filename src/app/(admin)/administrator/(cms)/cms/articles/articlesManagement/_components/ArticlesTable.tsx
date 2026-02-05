import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { Article, ArticleTableProps } from "../types";
import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { TableHeader } from "./TableHeader";
import { SearchBar } from "./SearchBar";
import { FilterControls } from "./FilterControls";
import { ResultsStats } from "./ResultsStats";
import { AdvancedFilters } from "./AdvancedFilters";
import { SortableItem } from "./SortableItem";

export const ArticlesTable = ({
  onReorder,
}: ArticleTableProps) => {
  const { articles, loading } = useArticlesManagementStore();
  const [showFilters, setShowFilters] = useState(false);

  const {
    draggedId,
    setDraggedId,
    dragOverId,
    setDragOverId,
    setTempOrder,
    setArticles,
  } = useArticlesManagementStore();

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, droppedId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== droppedId) {
      const oldIndex = articles.findIndex(
        (item) => item._id.toString() === draggedId,
      );

      const newIndex = articles.findIndex(
        (item) => item._id.toString() === droppedId,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = [...articles];
        const [movedItem] = newItems.splice(oldIndex, 1);

        newItems.splice(newIndex, 0, movedItem);

        const newTempOrder = new Map();

        newItems.forEach((item, index) => {
          newTempOrder.set(item._id.toString(), index + 1);
        });

        setTempOrder(newTempOrder);

        setArticles(newItems);

        if (onReorder) {
          const reorderedForSave = newItems.map((item, index) => ({
            ...item,
            numericId: index + 1,
          }));
          onReorder(reorderedForSave);
        }
      }
    }

    setDraggedId(null);
    setDragOverId(null);
    setTempOrder(new Map());
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
      <div className="divide-y divide-yellow-600">
        {articles.length === 0 ? (
          <EmptyState />
        ) : (
          articles.map((article) => {
            const articleId = article._id.toString();
            const isDragOver = dragOverId === articleId;

            return (
              <div
                key={articleId}
                draggable="true"
                onDragStart={() => handleDragStart(articleId)}
                onDragOver={(e) => handleDragOver(e, articleId)}
                onDrop={(e) => handleDrop(e, articleId)}
                className={`${isDragOver ? "bg-blue-50" : ""}`}
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
