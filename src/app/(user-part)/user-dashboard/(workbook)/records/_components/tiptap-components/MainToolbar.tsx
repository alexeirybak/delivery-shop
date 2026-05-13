import { useState } from "react";
import { GripVertical } from "lucide-react";
import { useToolbarOrder } from "../../hooks/useToolbarOrders";
import { CONFIG_TOOLBAR_COMPONENTS } from "../../utils/CONFIG_TOOLBAR";
import { MainToolbarProps } from "../../types";
import "../../styles/main-toolbar.css";

type ToolbarComponentId = keyof typeof CONFIG_TOOLBAR_COMPONENTS;

const MainToolbar = ({
  editor,
  onImageDragOverChange,
}: MainToolbarProps) => {
  const { groups, moveGroup } = useToolbarOrder();
  const [draggingGroupId, setDraggingGroupId] = useState<string | null>(null);
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null);

  if (!editor) {
    return null;
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    groupId: string,
  ) => {
    e.dataTransfer.setData("text/plain", groupId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingGroupId(groupId);

    const dragImage = document.createElement("div");
    dragImage.style.width = "100px";
    dragImage.style.height = "32px";
    dragImage.style.background = "var(--color-panel)";
    dragImage.style.border = "1px solid var(--color-line)";
    dragImage.style.borderRadius = "6px";
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 10, 16);

    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (groupId: string) => {
    if (groupId !== draggingGroupId) {
      setDragOverGroupId(groupId);
    }
  };

  const handleDragLeave = () => {
    setDragOverGroupId(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropGroupId: string,
  ) => {
    e.preventDefault();

    const draggedGroupId = e.dataTransfer.getData("text/plain");
    if (!draggedGroupId || draggedGroupId === dropGroupId) {
      resetDragState();
      return;
    }

    const fromIndex = groups.findIndex((g) => g.id === draggedGroupId);
    const toIndex = groups.findIndex((g) => g.id === dropGroupId);

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      moveGroup(fromIndex, toIndex);
    }

    resetDragState();
  };

  const resetDragState = () => {
    setDraggingGroupId(null);
    setDragOverGroupId(null);
  };

  const renderToolbarComponent = (itemId: string) => {
    const componentId = itemId as ToolbarComponentId;
    const config = CONFIG_TOOLBAR_COMPONENTS[componentId];

    const Component = config.component;

    const props = {
      editor,
      ...(onImageDragOverChange && { onDragOverChange: onImageDragOverChange }),
    };

    return (
      <div key={itemId} className="main-toolbar-item">
        <Component {...props} />
      </div>
    );
  };

  return (
    <div className="main-toolbar">
      <div className="main-toolbar-container">
        {groups.map((group) => (
          <div
            key={group.id}
            draggable
            onDragStart={(e) => handleDragStart(e, group.id)}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(group.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, group.id)}
            onDragEnd={resetDragState}
            className={`
              main-toolbar-group
              ${draggingGroupId === group.id ? "dragging" : ""}
              ${dragOverGroupId === group.id && draggingGroupId !== group.id ? "drag-over" : ""}
            `}
          >
            <div className="main-toolbar-drag-icon">
              <GripVertical />
            </div>
            <div className="main-toolbar-items">
              {group.items.map((itemId: string) =>
                renderToolbarComponent(itemId),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainToolbar;
