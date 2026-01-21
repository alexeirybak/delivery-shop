"use client";

import { useState } from "react";

const DEFAULT_GROUPS = [
  {
    id: "history",
    name: "История",
    items: ["history"],
  },
  {
    id: "paragraph",
    name: "Параграф",
    items: ["paragraph", "quote"],
  },
  {
    id: "text",
    name: "Текст",
    items: ["textLevel"],
  },
  {
    id: "textFormatting",
    name: "Форматирование",
    items: ["textFormatting"],
  },
  {
    id: "color",
    name: "Цвет текста и фона",
    items: ["textColor", "bgColor"],
  },
  {
    id: "fontSize",
    name: "Размер шрифта",
    items: ["fontSize"],
  },
  {
    id: "list",
    name: "Списки",
    items: ["list"],
  },
  {
    id: "formatting",
    name: "Форматирование",
    items: ["alignment"],
  },
  {
    id: "code",
    name: "Код",
    items: ["codeEditor"],
  },
  {
    id: "table",
    name: "Таблицы",
    items: ["table"],
  },
  {
    id: "links",
    name: "Ссылки",
    items: ["link"],
  },
  {
    id: "images",
    name: "Изображения",
    items: ["image"],
  },
  {
    id: "imageAttributes",
    name: "Атрибуты изображения",
    items: ["imageAttributes"],
  },
  {
    id: "ai",
    name: "AI",
    items: ["ai", "imageAI"],
  },
];

export type ToolbarGroup = {
  id: string;
  name: string;
  items: string[];
};

export const useToolbarOrder = () => {
  const [groups, setGroups] = useState<ToolbarGroup[]>(() => {
    if (typeof window === "undefined") return DEFAULT_GROUPS;

    try {
      const saved = localStorage.getItem("toolbar-order");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Проверяем структуру сохраненных данных
        return Array.isArray(parsed) ? parsed : DEFAULT_GROUPS;
      }
    } catch (error) {
      console.error("Error loading toolbar order:", error);
    }

    return DEFAULT_GROUPS;
  });

  // Сохраняем порядок в localStorage
  // useEffect(() => {
  //   try {
  //     localStorage.setItem("toolbar-order", JSON.stringify(groups));
  //   } catch (error) {
  //     console.error("Error saving toolbar order:", error);
  //   }
  // }, [groups]);

  const moveGroup = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setGroups((prev) => {
      const newGroups = [...prev];
      const [movedGroup] = newGroups.splice(fromIndex, 1);
      newGroups.splice(toIndex, 0, movedGroup);
      return newGroups;
    });
  };

  return { groups, moveGroup };
};
