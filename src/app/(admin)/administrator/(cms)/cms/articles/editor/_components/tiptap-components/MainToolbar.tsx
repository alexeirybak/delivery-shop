import { TextFormattingMenu } from "./TextFormattingMenu";
import { ListMenu } from "./ListMenu";
import { CodeEditorButton } from "./CodeEditorButton";
import { AlignmentMenu } from "./AlignmentMenu";
import { HistoryMenu } from "./HistoryMenu";
import { LinkMenu } from "./LinkMenu";
import { TableMenu } from "./TableMenu";
import { FontSizeMenu } from "./FontSizeMenu";
import { ImageMenu } from "./ImageMenu";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import { TextColorMenu } from "./TextColorMenu";
import { BgColorMenu } from "./BgColorMenu";
import { QuoteButton } from "./QuoteButton";
import { ImageAttributes } from "./ImageAttributes";
import { useToolbarOrder } from "../../../hooks/useToolbarOrders";
import { TextLevelMenu } from "./TextLevelMenu";
import { MainToolbarProps } from "../../../types";

const CONFIG_TOOLBAR_COMPONENTS = {
  history: { component: HistoryMenu },
  textLevel: { component: TextLevelMenu },
  fontSize: { component: FontSizeMenu },
  textFormatting: { component: TextFormattingMenu },
  quote: { component: QuoteButton },
  codeEditor: { component: CodeEditorButton },
  alignment: { component: AlignmentMenu },
  textColor: { component: TextColorMenu },
  bgColor: { component: BgColorMenu },
  list: { component: ListMenu },
  link: { component: LinkMenu },
  table: { component: TableMenu },
  image: { component: ImageMenu },
  imageAttributes: { component: ImageAttributes },
} as const;

// Тип для идентификаторов компонентов
type ToolbarComponentId = keyof typeof CONFIG_TOOLBAR_COMPONENTS;

export const MainToolbar = ({
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

  // Функция для рендеринга компонента по его ID
  const renderToolbarComponent = (itemId: string) => {
    // Приводим itemId к правильному типу
    const componentId = itemId as ToolbarComponentId;
    const config = CONFIG_TOOLBAR_COMPONENTS[componentId];

    if (!config) {
      console.warn(`Компонент с ID "${itemId}" не найден в конфигурации`);
      return null;
    }

    const Component = config.component;
    const baseProps = { editor };

    // Особый случай для ImageMenu - передаем дополнительный пропс
    if (componentId === "image" && onImageDragOverChange) {
      // Приводим Component к типу, который принимает onImageDragOverChange
      const ImageComponent = Component as React.ComponentType<MainToolbarProps>;
      return (
        <div
          key={itemId}
          className="p-0.5 rounded hover:bg-gray-100 transition-colors"
        >
          <ImageComponent
            {...baseProps}
            onImageDragOverChange={onImageDragOverChange}
          />
        </div>
      );
    }

    // Для всех остальных компонентов передаем только editor
    return (
      <div
        key={itemId}
        className="p-0.5 rounded hover:bg-gray-100 transition-colors"
      >
        <Component {...baseProps} />
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
              {group.items.map((itemId) => renderToolbarComponent(itemId))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
