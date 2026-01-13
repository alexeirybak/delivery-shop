"use client";

import { TextLevelMenu } from "./TextLevelMenu";
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
import { ImageAIMenu } from "./imageAI/ImageAIMenu";
import { ColorMenu } from "./ColorMenu";
import { TipTapMenuProps } from "../../../types";
import { Fragment } from "react";

export const MainToolbar = ({ editor }: TipTapMenuProps) => {
  if (!editor) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const menuItems = [
    { component: HistoryMenu, key: "history" },
    { component: TextLevelMenu, key: "text-level" },
    { component: TextFormattingMenu, key: "text-formatting" },
    { component: ColorMenu, key: "color" },
    { component: FontSizeMenu, key: "font-size" },
    { component: ListMenu, key: "list" },
    { component: BlockMenu, key: "block" },
    { component: AlignmentMenu, key: "alignment" },
    { component: LinkMenu, key: "link" },
    { component: ImageMenu, key: "image" },
    { component: ImageAIMenu, key: "image-ai" },
    { component: TableMenu, key: "table" },
    { component: AIMenu, key: "ai" },
  ];

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-2">
      {menuItems.map((item, index) => (
        <Fragment key={item.key}>
          <item.component editor={editor} />
          {index < menuItems.length - 1 && (
            <div className="w-px h-6 bg-gray-300"></div>
          )}
        </Fragment>
      ))}
    </div>
  );
};