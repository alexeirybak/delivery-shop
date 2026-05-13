import { Plus } from "lucide-react";
import { HeaderActionsProps } from "../types";
import "../styles/header-actions.css";

export function HeaderActions({ onCreate }: HeaderActionsProps) {
  return (
    <div className="header-actions-categories">
      <div className="header-actions-buttons">
        <button onClick={onCreate} className="header-actions-create-btn">
          <Plus />
          Новая тетрадь
        </button>
      </div>
    </div>
  );
}
