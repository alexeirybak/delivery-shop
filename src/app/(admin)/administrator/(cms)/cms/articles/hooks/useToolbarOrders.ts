"use client";

import { useEffect, useState } from "react";

const DEFAULT_GROUPS = [
  {
    id: "history",
    name: "История",
    items: ["history"],
  },
  {
    id: "text",
    name: "Текст",
    items: ["textLevel", "fontSize"],
  },

  {
    id: "textFormatting",
    name: "Форматирование",
    items: ["textFormatting"],
  },
  {
    id: "quoteCode",
    name: "Цитаты и код",
    items: ["quote", "codeEditor"],
  },
  {
    id: "alignment",
    name: "Выравнивание",
    items: ["alignment"],
  },
  {
    id: "color",
    name: "Цвет текста и фона",
    items: ["textColor", "bgColor"],
  },
  {
    id: "list",
    name: "Списки",
    items: ["list"],
  },
  {
    id: "links",
    name: "Ссылки",
    items: ["link"],
  },
  {
    id: "table",
    name: "Таблицы",
    items: ["table"],
  },
  {
    id: "images",
    name: "Изображения",
    items: ["image", "imageAttributes"],
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
        return Array.isArray(parsed) ? parsed : DEFAULT_GROUPS;
      }
    } catch (error) {
      console.error("Ошибка загрузки порядка компонентов:", error);
    }

    return DEFAULT_GROUPS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("toolbar-order", JSON.stringify(groups));
    } catch (error) {
      console.error("Error saving toolbar order:", error);
    }
  }, [groups]);

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
