"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DashboardChat,
  LibraryViewProps,
  SortBy,
  SortOrder,
  CollectionType,
} from "../types";
import { CyberLoader } from "./CyberLoader";
import { LibraryStats } from "./LibraryStats";
import { LibraryFilters } from "./LibraryFilters";
import { LibraryEmptyState } from "./LibraryEmptyState";
import { LibraryResultsInfo } from "./LibraryResultsInfo";
import { LibraryGrid } from "./LibraryGrid";
import { LibraryPagination } from "./LibraryPagination";
import "../styles/library.css";

const STORAGE_KEY = "library_filters";

interface StoredFilters {
  searchQuery: string;
  typeFilter: CollectionType;
  sortBy: SortBy;
  sortOrder: SortOrder;
  viewMode: "grid" | "list";
}

const defaultFilters: StoredFilters = {
  searchQuery: "",
  typeFilter: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  viewMode: "grid",
};

const loadSavedFilters = (): StoredFilters => {
  if (typeof window === "undefined") return defaultFilters;

  const savedFilters = localStorage.getItem(STORAGE_KEY);
  if (savedFilters) {
    try {
      const parsed = JSON.parse(savedFilters) as StoredFilters;
      return {
        searchQuery: parsed.searchQuery ?? defaultFilters.searchQuery,
        typeFilter: parsed.typeFilter ?? defaultFilters.typeFilter,
        sortBy: parsed.sortBy ?? defaultFilters.sortBy,
        sortOrder: parsed.sortOrder ?? defaultFilters.sortOrder,
        viewMode: parsed.viewMode ?? defaultFilters.viewMode,
      };
    } catch (error) {
      console.error("Ошибка загрузки фильтров:", error);
      return defaultFilters;
    }
  }
  return defaultFilters;
};

export const LibraryView = ({ onTabChange }: LibraryViewProps) => {
  const [items, setItems] = useState<DashboardChat[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [totalMaterialsInDB, setTotalMaterialsInDB] = useState(0);
  const [activeDays, setActiveDays] = useState(0);
  const [uniqueTypesCount, setUniqueTypesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(defaultFilters.searchQuery);
  const [typeFilter, setTypeFilter] = useState<CollectionType>(
    defaultFilters.typeFilter,
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    defaultFilters.viewMode,
  );
  const [sortBy, setSortBy] = useState<SortBy>(defaultFilters.sortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    defaultFilters.sortOrder,
  );

  const limit = 12;

  useEffect(() => {
    const savedFilters = loadSavedFilters();
    setSearchQuery(savedFilters.searchQuery);
    setTypeFilter(savedFilters.typeFilter);
    setSortBy(savedFilters.sortBy);
    setSortOrder(savedFilters.sortOrder);
    setViewMode(savedFilters.viewMode);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const filtersToSave: StoredFilters = {
      searchQuery,
      typeFilter,
      sortBy,
      sortOrder,
      viewMode,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtersToSave));
  }, [searchQuery, typeFilter, sortBy, sortOrder, viewMode, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      setCurrentPage(1);
    }
  }, [searchQuery, typeFilter, sortBy, sortOrder, isInitialized]);

  const loadMaterials = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        search: searchQuery,
        type: typeFilter,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/chats/list?${params}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setTotalMaterialsInDB(data.totalMaterialsInDB);
        setActiveDays(data.activeDays);
        setUniqueTypesCount(data.uniqueTypesCount);
        setFavoritesCount(data.favoritesCount);
      }
    } catch (error) {
      console.error("Ошибка загрузки материалов:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, typeFilter, sortBy, sortOrder, limit]);

  const loadFavoritesCount = useCallback(async () => {
    try {
      const response = await fetch("/api/chats/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavoritesCount(data.length);
      }
    } catch (error) {
      console.error("Ошибка загрузки избранного:", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      loadMaterials();
      loadFavoritesCount();
    }
  }, [isInitialized, loadMaterials, loadFavoritesCount]);

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const handleMaterialDeleted = () => {
    loadMaterials();
    loadFavoritesCount();
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    loadMaterials();
  };

  const hasFilters = searchQuery !== "" || typeFilter !== "all";

  if (!isInitialized || isLoading) {
    return (
      <div className="dashboard-loading-state">
        <CyberLoader />
        <span>Загрузка...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-library">
      <LibraryStats
        totalMaterials={totalMaterialsInDB}
        activeDays={activeDays}
        uniqueTypesCount={uniqueTypesCount}
        favoritesCount={favoritesCount}
      />

      <LibraryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={toggleSortOrder}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={clearFilters}
        isLoading={isLoading}
      />

      {items.length === 0 ? (
        <LibraryEmptyState
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
          onCreateMaterial={
            onTabChange ? () => onTabChange("generate") : undefined
          }
        />
      ) : (
        <>
          <LibraryResultsInfo
            filteredCount={total}
            totalCount={total}
            sortBy={sortBy}
            sortOrder={sortOrder}
            typeFilter={typeFilter}
            searchQuery={searchQuery}
            favoritesCount={favoritesCount}
            totalMaterials={totalMaterialsInDB}
          />

          <LibraryGrid
            materials={items}
            viewMode={viewMode}
            onMaterialDeleted={handleMaterialDeleted}
          />

          <LibraryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};
