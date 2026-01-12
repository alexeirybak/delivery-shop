"use client";

import { Editor } from "@tiptap/react";
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
import { ImageAIMenu } from "./imageAI/ImageAIMenu"; // Добавляем новый компонент

interface MainToolbarProps {
  editor: Editor | null;
}

export const MainToolbar = ({ editor }: MainToolbarProps) => {
  if (!editor) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-2">
      {/* История */}
      <HistoryMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Заголовки */}
      <TextLevelMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Форматирование текста */}
      <TextFormattingMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Размер шрифта */}
      <FontSizeMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Списки */}
      <ListMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Блоки */}
      <BlockMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Выравнивание */}
      <AlignmentMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Ссылки */}
      <LinkMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Изображения */}
      <ImageMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* AI Генерация изображений */}
      <ImageAIMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* Таблицы */}
      <TableMenu editor={editor} />

      {/* Разделитель */}
      <div className="w-px h-6 bg-gray-300"></div>

      {/* AI функции (текст) */}
      <AIMenu editor={editor} />
    </div>
  );
};
