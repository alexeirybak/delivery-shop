import { MainToolbarProps, ToolbarComponentId } from "../../../types";
import { useToolbarOrder } from "../../../hooks/useToolbarOrders";
import { useState } from "react";
import { CONFIG_TOOLBAR_COMPONENTS } from "../../../utils/CONFIG_TOOLBAR";
import { GripVertical } from "lucide-react";

const MainToolbar = ({ editor, onImageDragOverChange }: MainToolbarProps) => {
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
    dragImage.style.background = "#f3f4f6";
    dragImage.style.border = "1px solid #d1d5db";
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
        ...(onImageDragOverChange && {onDragOverChange: onImageDragOverChange}),
      };

      return (
        <div
          key={itemId}
          className="p-0.5 rounded hover:bg-gray-100 duration-300 cursor-pointer"
        >
          <Component {...props} />
        </div>
      );
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 py-1.5 px-2">
      <div className="flex flex-wrap items-center gap-1.5">
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
              flex items-center gap-1 px-2 py-1.5 rounded-lg border duration-300 cursor-pointer
              min-h-14 box-content
              ${
                draggingGroupId === group.id
                  ? "border-blue-400 bg-blue-50 opacity-60 cursor-grabbing scale-95"
                  : "border-gray-300 hover:border-gray-400 cursor-grab"
              }
              ${
                dragOverGroupId === group.id && draggingGroupId !== group.id
                  ? "border-green-500 bg-green-50 ring-1 ring-green-300"
                  : ""
              }
            `}
          >
            <div className="text-gray-400 opacity-60 hover:opacity-100 transition-opacity -ml-1 mr-0.5">
              <GripVertical className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-0.5">
              {group.items.map((itemId) => renderToolbarComponent(itemId))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainToolbar;
