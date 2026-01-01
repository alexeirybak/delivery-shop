import React from "react";
import { DragHandleProps } from "../../types";

export const DragHandle = React.forwardRef<HTMLDivElement, DragHandleProps>(
  () => (
    <div
      className="flex items-center justify-center cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity p-2"
      title="Перетащить для сортировки"
    >
      <div className="flex flex-col space-y-1">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  )
);

DragHandle.displayName = "DragHandle";
