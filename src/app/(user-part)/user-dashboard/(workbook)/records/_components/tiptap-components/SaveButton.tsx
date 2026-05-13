"use client";

import { Save, Clock } from "lucide-react";
import { useRecordStore } from "@/store/recordStore";
import "../../styles/save-button.css";

export const SaveButton = () => {
  const { autoSaveOn, setAutoSaveOn, saveFunction } = useRecordStore();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saveFunction) {
      saveFunction();
    }
  };

  const handleToggleAutoSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoSaveOn(!autoSaveOn);
  };

  return (
    <div className="save-button-group" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleSave}
        className="save-button"
        title="Сохранить"
      >
        <Save />
      </button>

      <button
        type="button"
        onClick={handleToggleAutoSave}
        className={`save-button ${autoSaveOn ? "active" : ""}`}
        title={
          autoSaveOn ? "Выключить автосохранение" : "Включить автосохранение каждые 5 мин"
        }
      >
        <Clock />
        {autoSaveOn && <span className="save-badge" />}
      </button>
    </div>
  );
};