"use client";

interface InStockToggleProps {
  checked: boolean;
  onChangeAction: (checked: boolean) => void;
  labelText?: string;
}

const InStockToggle = ({ checked, onChangeAction, labelText }: InStockToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id="inStock"
          checked={checked}
          onChange={(e) => onChangeAction(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-[46px] h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#70c05b] transition-colors duration-200">
          <div
            className={`
                absolute top-0.5 left-0
                w-5 h-5
                border-[0.5px] border-[rgba(0,0,0,0.04)]
                rounded-full
                shadow-[0px_1px_1px_rgba(0,0,0,0.08),0px_2px_6px_rgba(0,0,0,0.15)]
                bg-white
                transition-transform duration-300
                ${
                  checked
                    ? "transform translate-x-6"
                    : "transform translate-x-0"
                }
              `}
          ></div>
        </div>
        <span className="ml-2 text-sm text-main-text">{labelText}</span>
      </label>
    </div>
  );
};

export default InStockToggle;
