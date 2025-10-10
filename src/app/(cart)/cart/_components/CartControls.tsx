interface CartControlsProps {
  isAllSelected: boolean;
  selectedItemsCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onRemoveSelected: () => void;
}

const CartControls = ({
  isAllSelected,
  selectedItemsCount,
  onSelectAll,
  onDeselectAll,
  onRemoveSelected,
}: CartControlsProps) => {
  return (
    <div className="flex items-center gap-x-10 mb-4 xl:mb-6">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={(e) => (e.target.checked ? onSelectAll() : onDeselectAll())}
          className="hidden"
        />
        <div className="w-6 h-6 bg-primary border border-[#f3f2f1] rounded flex items-center justify-center duration-300">
          {isAllSelected ? (
            <div className="w-[15px] h-[1px] bg-white"></div>
          ) : (
            <div className="relative w-[15px] h-[15px]">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white transform -translate-x-1/2"></div>
            </div>
          )}
        </div>
        <span className="text-xs">Выделить все</span>
      </label>

      {selectedItemsCount > 0 && (
        <button
          onClick={onRemoveSelected}
          className="text-[#ff6633] hover:underline text-xs cursor-pointer"
        >
          Удалить выбранные
        </button>
      )}
    </div>
  );
};

export default CartControls;
