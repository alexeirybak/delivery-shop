import { useEffect, useState } from "react";
import { CONFIG_GROUPS } from "../utils/CONFIG_TOOLBAR";
import { ToolbarGroup } from "../types";

export const useToolbarOrder = () => {
  const [groups, setGroups] = useState<ToolbarGroup[]>(() => {

    try {
      const saved = localStorage.getItem("toolbar-order");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : CONFIG_GROUPS;
      }
    } catch (error) {
      console.error("Ошибка загрузки порядка компонентов:", error);
    }

    return CONFIG_GROUPS;
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
