"use client";

import { Loader2 } from "lucide-react";
import { buttonStyles } from "@/app/(auth)/styles";

interface EditActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  onEditStart: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditActions: React.FC<EditActionsProps> = ({
  isEditing,
  isLoading,
  onEditStart,
  onSave,
  onCancel,
}) => {
  if (!isEditing) {
    return (
      <button
        onClick={onEditStart}
        className={`${buttonStyles.active} flex-1 py-3 px-6 rounded font-medium duration-300 cursor-pointer`}
      >
        Редактировать профиль
      </button>
    );
  }

  return (
    <>
      <button
        onClick={onSave}
        disabled={isLoading}
        className="bg-primary text-white hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) flex flex-1 rounded px-4 [&&]:h-10 cursor-pointer items-center justify-center gap-2 mx-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4 text-white" />
            Сохранение...
          </>
        ) : (
          "Сохранить изменения"
        )}
      </button>
      
      <button
        onClick={onCancel}
        className="flex flex-1 items-center justify-center h-10 bg-[#f3f2f1] text-[#606060] px-4 rounded font-medium hover:shadow-button-cancel active:shadow-button-cancel-active duration-300 cursor-pointer"
      >
        Отмена
      </button>
    </>
  );
};

export default EditActions;