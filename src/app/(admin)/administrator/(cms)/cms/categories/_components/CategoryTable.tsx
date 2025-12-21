import {
  Category,
  ExtendedCategoryTableProps,
  SortField,
} from "../../types";
import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableItem } from "./SortableItem";
import { SearchBar } from "./SearchBar";
import { FilterControls } from "./FilterControls";
import { AdvancedFilters } from "./AdvancedFilters";
import { ResultsStats } from "./ResultsStats";
import { TableHeader } from "./TableHeader";
import { EmptyState } from "./EmptyState";

export const CategoryTable = ({
  categories,
  loading,
  onEdit,
  onDelete,
  onReorder,
  searchQuery,
  filterType,
  sortField,
  sortDirection,
  onSearchChange,
  onSearch,
  onFilterTypeChange,
  onSortFieldChange,
  onSortDirectionChange,
  isSearching = false,
  totalItems,
}: ExtendedCategoryTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState<Category[]>(categories);
  const [tempOrder, setTempOrder] = useState<Map<string, number>>(new Map());
  const [isMobileView, setIsMobileView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setItems(categories);
    setTempOrder(new Map());
  }, [categories]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleRow = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex(
          (item) => item._id.toString() === active.id
        );
        const newIndex = currentItems.findIndex(
          (item) => item._id.toString() === over.id
        );

        if (oldIndex === -1 || newIndex === -1) {
          return currentItems;
        }

        const newItems = arrayMove(currentItems, oldIndex, newIndex);

        const newTempOrder = new Map(tempOrder);
        newItems.forEach((item, index) => {
          newTempOrder.set(item._id.toString(), index + 1);
        });
        setTempOrder(newTempOrder);

        requestAnimationFrame(() => {
          if (onReorder) {
            const reorderedForSave = newItems.map((item, index) => ({
              ...item,
              numericId: index + 1,
            }));
            onReorder(reorderedForSave);
          }
        });

        return newItems;
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getDisplayNumericId = useCallback(
    (category: Category): number | null => {
      const tempId = tempOrder.get(category._id.toString());
      return tempId !== undefined ? tempId : category.numericId;
    },
    [tempOrder]
  );

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc");
      } else {
        onSortFieldChange(field);
        onSortDirectionChange("asc");
      }
    },
    [sortField, sortDirection, onSortFieldChange, onSortDirectionChange]
  );

  const resetFilters = useCallback(() => {
    onSearchChange("");
    onFilterTypeChange("all");
    onSortFieldChange("numericId");
    onSortDirectionChange("asc");
  }, [
    onSearchChange,
    onFilterTypeChange,
    onSortFieldChange,
    onSortDirectionChange,
  ]);

  const hasActiveFilters = Boolean(
    filterType !== "all" || sortField !== "numericId" || sortDirection !== "asc"
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Загрузка категорий...</div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="bg-white rounded shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onSearch={onSearch}
              placeholder="Поиск категорий..."
              isSearching={isSearching}
            />

            <FilterControls
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              onResetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {showFilters && (
            <AdvancedFilters
              filterType={filterType}
              sortField={sortField}
              sortDirection={sortDirection}
              onFilterTypeChange={onFilterTypeChange}
              onSortFieldChange={onSortFieldChange}
              onSortDirectionChange={onSortDirectionChange}
            />
          )}

          <ResultsStats
            filteredCount={categories.length}
            totalItems={totalItems}
            searchQuery={searchQuery}
          />
        </div>

        <TableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <SortableContext
          items={items.map((item) => item._id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="divide-y divide-gray-200">
            {items.length === 0 ? (
              <EmptyState searchQuery={searchQuery} />
            ) : (
              items.map((category, index) => {
                const categoryId = category._id.toString();
                const isExpanded = expandedRows.has(categoryId);

                return (
                  <SortableItem
                    key={categoryId}
                    id={categoryId}
                    category={category}
                    displayNumericId={getDisplayNumericId(category)}
                    isExpanded={isExpanded}
                    onToggle={toggleRow}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isMobile={isMobileView}
                    activeId={activeId}
                    position={index}
                  />
                );
              })
            )}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
};