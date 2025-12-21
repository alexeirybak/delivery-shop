import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableItemProps, Transform } from "../../types";
import { MobileCategoryCard } from "./MobileCategoryCard";
import { DesktopCategoryRow } from "./DesktopCategoryRow";

export const SortableItem: React.FC<
  SortableItemProps & {
    activeId: string | null;
    position?: number;
  }
> = ({
  id,
  category,
  displayNumericId,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  isMobile,
  activeId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform as Transform),
    transition: transition as string,
    opacity: isDragging ? 0.4 : 1,
  };

  const isActiveDragging = activeId === id;

  const handleDragHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragHandleProps = {
    ref: setActivatorNodeRef,
    attributes,
    listeners: listeners || undefined,
    onClick: handleDragHandleClick,
  };

  if (isMobile) {
    return (
      <div ref={setNodeRef}>
        <MobileCategoryCard
          category={category}
          displayNumericId={displayNumericId}
          isExpanded={isExpanded}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          dragHandleProps={dragHandleProps}
          style={style}
          isDragging={isDragging}
          isActiveDragging={isActiveDragging}
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef}>
      <DesktopCategoryRow
        category={category}
        displayNumericId={displayNumericId}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
        style={style}
        isDragging={isDragging}
        isActiveDragging={isActiveDragging}
      />
    </div>
  );
};