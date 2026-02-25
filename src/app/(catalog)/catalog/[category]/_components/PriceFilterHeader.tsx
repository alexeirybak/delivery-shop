"use client";

interface PriceFilterHeaderProps {
  onResetAction: () => void;
}

const PriceFilterHeader = ({ onResetAction }: PriceFilterHeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <p className="text-black text-base">Цена</p>
      <button
        type="button"
        onClick={onResetAction}
        className="text-xs rounded bg-[#f3f2f1] h-8 p-2 cursor-pointer  hover:bg-primary hover:shadow-(--shadow-button-default) hover:text-white active:shadow-(--shadow-button-active) transition-custom"
      >
        Очистить
      </button>
    </div>
  );
};

export default PriceFilterHeader;
