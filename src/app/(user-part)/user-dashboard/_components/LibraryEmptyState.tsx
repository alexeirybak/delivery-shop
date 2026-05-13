"use client";

import { FolderOpen } from "lucide-react";

interface LibraryEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onCreateMaterial?: () => void;
}

export const LibraryEmptyState = ({
  hasFilters,
  onClearFilters,
  onCreateMaterial,
}: LibraryEmptyStateProps) => {
  return (
    <div className="dashboard-empty-state">
      <FolderOpen className="w-16 h-16" />
      <h3>Библиотека пуста</h3>
      <p>
        {hasFilters
          ? "Ничего не найдено по заданным фильтрам"
          : "Начните создавать материалы с помощью генератора"}
      </p>
      {hasFilters && (
        <button onClick={onClearFilters} className="clear-filters-btn">
          Очистить фильтры
        </button>
      )}
      {!hasFilters && onCreateMaterial && (
        <button onClick={onCreateMaterial} className="create-btn">
          Создать материал
        </button>
      )}
    </div>
  );
};
