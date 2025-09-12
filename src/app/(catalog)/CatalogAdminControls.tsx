import { CatalogAdminControlsProps } from "@/types/catalogAdminControlsProps";

const CatalogAdminControls = ({
  isEditing,
  onToggleEditingAction,
  onResetLayoutAction,
}: CatalogAdminControlsProps) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onToggleEditingAction}
        className="text-sm md:text-base border border-primary hover:text-white hover:bg-[#ff6633] hover:border-transparent active:shadow-(--shadow-button-active) w-2/3 h-10 rounded p-2 justify-center items-center text-primary transition-all duration-300 cursor-pointer select-none"
      >
        {isEditing ? "Закончить редактирование" : "Изменить расположение"}
      </button>
      {isEditing && (
        <button
          onClick={onResetLayoutAction}
          className="ml-3 p-2 text-xs justify-center items-center active:shadow-(--shadow-button-active) border-none rounded cursor-pointer transition-colors duration-300 bg-[#f3f2f1] hover:shadow-(--shadow-button-secondary)"
        >
          Сбросить
        </button>
      )}
    </div>
  );
};

export default CatalogAdminControls;
