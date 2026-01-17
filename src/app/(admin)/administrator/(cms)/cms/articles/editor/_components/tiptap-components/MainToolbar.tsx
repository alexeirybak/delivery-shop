"use client";

import { TextFormattingMenu } from "./TextFormattingMenu";
import { ListMenu } from "./ListMenu";
import { BlockMenu } from "./BlockMenu";
import { AlignmentMenu } from "./AlignmentMenu";
import { HistoryMenu } from "./HistoryMenu";
import { LinkMenu } from "./LinkMenu";
import { TableMenu } from "./TableMenu";
import { FontSizeMenu } from "./FontSizeMenu";
import { ImageMenu } from "./ImageMenu";
import { AIMenu } from "./textAI/AIMenu";
import { EditorProps } from "../../../types";
import { useToolbarOrder } from "../../hooks/useToolbarOrder";
import { useState } from "react";
import { ImageAIMenu } from "./imageAI/ImageAIMenu";
import { ColorMenu } from "./ColorMenu";
import { GripVertical } from "lucide-react";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ParagraphButton } from "./ParagraphButton";

const COMPONENT_MAP: Record<string, React.ComponentType<EditorProps>> = {
  history: HistoryMenu,
  textLevel: HeadingDropdownMenu,
  paragraph: ParagraphButton,
  textFormatting: TextFormattingMenu,
  color: ColorMenu,
  fontSize: FontSizeMenu,
  list: ListMenu,
  block: BlockMenu,
  alignment: AlignmentMenu,
  link: LinkMenu,
  table: TableMenu,
  image: ImageMenu,
  ai: AIMenu,
  imageAI: ImageAIMenu,
};

export const MainToolbar = ({ editor }: EditorProps) => {
  const { groups, moveGroup } = useToolbarOrder();
  const [draggingGroupId, setDraggingGroupId] = useState<string | null>(null);
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null);

  if (!editor) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    groupId: string
  ) => {
    e.dataTransfer.setData("text/plain", groupId);
    e.dataTransfer.effectAllowed = "move";
    setDraggingGroupId(groupId);
    
    // Для компактного drag image
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropGroupId: string) => {
    e.preventDefault();
    
    const draggedGroupId = e.dataTransfer.getData("text/plain");
    if (!draggedGroupId || draggedGroupId === dropGroupId) {
      resetDragState();
      return;
    }

    const fromIndex = groups.findIndex(g => g.id === draggedGroupId);
    const toIndex = groups.findIndex(g => g.id === dropGroupId);
    
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      moveGroup(fromIndex, toIndex);
    }
    
    resetDragState();
  };

  const resetDragState = () => {
    setDraggingGroupId(null);
    setDragOverGroupId(null);
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
              flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all duration-150
              min-h-9 max-h-10 box-content
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
            {/* Индикатор перетаскивания в левой части */}
            <div className="text-gray-400 opacity-60 hover:opacity-100 transition-opacity -ml-1 mr-0.5">
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            {/* Элементы внутри группы */}
            <div className="flex items-center gap-0.5">
              {group.items.map((itemId) => {
                const Component = COMPONENT_MAP[itemId];
                if (!Component) return null;

                return (
                  <div
                    key={itemId}
                    className="p-0.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Component editor={editor} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};